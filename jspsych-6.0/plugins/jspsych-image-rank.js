/**
 * jspsych-image-rank
 * plugin for ranking a collection of images
 * Shaoliang Nie
 *
 * documentation: docs.jspsych.org
 */


jsPsych.plugins['image-rank'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-rank', 'stimuli', 'image');

  plugin.info = {
    name: 'image-rank',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'Images to be displayed.'
      },
      stim_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus height',
        default: 100,
        description: 'Height of images in pixels.'
      },
      stim_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus width',
        default: 100,
        description: 'Width of images in pixels'
      },
      rank_area_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sort area height',
        default: 150,
        description: 'The height of the container that subjects can move the stimuli in.'
      },
      rank_area_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sort area width',
        default: 600,
        description: 'The width of the container that subjects can move the stimuli in.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'It can be used to provide a reminder about the action the subject is supposed to take.'
      },
      prompt_location: {
        type: jsPsych.plugins.parameterType.SELECT,
        pretty_name: 'Prompt location',
        options: ['above','below'],
        default: 'above',
        description: 'Indicates whether to show prompt "above" or "below" the sorting area.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to continue to the next trial.'
      },

      // paramters for the buttons of each image
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        default: [],
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button html',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var start_time = (new Date()).getTime();

    // data to be recorded
    var ranks = [];
    for (var i = 0; i < trial.stimuli.length; i++) {
      ranks.push(-1);
    }

    // shuffle the images
    shuffle(trial.stimuli);

    var html = "";
    // check if there is a prompt and if it is shown above
    if (trial.prompt !== null && trial.prompt_location == "above") {
      html += trial.prompt;
    }

    html += '<div '+
      'id="jspsych-image-rank-arena" '+
      'class="jspsych-image-rank-arena" '+
      'style="position: relative; width:'+trial.rank_area_width+'px; height:'+trial.rank_area_height+'px;"'+
      '></div>';

    // check if prompt exists and if it is shown below
    if (trial.prompt !== null && trial.prompt_location == "below") {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in image-rank-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }

    for (var i = 0; i < trial.stimuli.length; i++) {
      var coords = {'x': 120 + i * (trial.stim_width + 30), 'y': 0};

      display_element.querySelector("#jspsych-image-rank-arena").insertAdjacentHTML('beforeend', '<img '+
        'src="'+trial.stimuli[i]+'" '+
        'data-src="'+trial.stimuli[i]+'" '+
        'style="position: absolute; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+coords.y+'px; left:'+coords.x+'px;">'+
        '</img>');

      display_element.querySelector("#jspsych-image-rank-arena").insertAdjacentHTML('beforeend', '<div ' + 
      'style="position: absolute; top:'+(coords.y+trial.stim_height+10)+'px; left:'+coords.x+'px;"'+
      'id="jspsych-image-rank-response-btngroup-'+i+'"></div>');

      for (var j = 0; j < trial.choices.length; j++) {
        var str = buttons[j].replace(/%choice%/g, trial.choices[j]);
        
        display_element.querySelector('#jspsych-image-rank-response-btngroup-' + i).insertAdjacentHTML('beforeend',
          '<div class="jspsych-image-rank-response-button jspsych-image-rank-response-button-'+i+'" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-image-rank-response-button-' + i + '' + j +'" data-choice="' +i+ ":" +j+' ">'+str+'</div>');

        display_element.querySelector('#jspsych-image-rank-response-button-' + i + '' + j).addEventListener('click', function(e){
          const cur = e.currentTarget;
          cur.firstElementChild.style.backgroundColor = 'gray';
          for (var sib of cur.parentElement.children) {
            if (sib != cur)  {
              sib.firstElementChild.style.backgroundColor = 'white';
            }
          }
          const choice = cur.getAttribute('data-choice').split(':');
          ranks[parseInt(choice[0])] = parseInt(choice[1]);
        });
      }
    }

    display_element.insertAdjacentHTML('beforeend', '<button id="jspsych-image-rank-done-btn" class="jspsych-btn">'+trial.button_label+'</button>');

    display_element.querySelector('#jspsych-image-rank-done-btn').addEventListener('click', function(){

      // check if the answer is valid
      const s = new Set(ranks);
      if (s.size < trial.stimuli.length) {
        display_element.firstElementChild.innerText = "The answer is invalid. Please check.";
        display_element.firstElementChild.style.color = 'red';
        return;
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      var end_time = (new Date()).getTime();
      var rt = end_time - start_time;

      // gather data
      var rank_result = [];
      for (var i = 0; i < trial.stimuli.length; i++) {
        rank_result.push(null);
      }
      for (var i = 0; i < ranks.length; i++) {
        rank_result[ranks[i]] = trial.stimuli[i];
      }

      var trial_data = {
        "src": trial.stimuli,
        "rank_data": ranks,
        "rank_result": rank_result,
        "rt": rt
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    });
  };


  // helper functions
  // reference: https://www.frankmitchell.org/2015/01/fisher-yates/
  function shuffle (array) {
    var i = 0, j = 0, t = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
  }

  return plugin;
})();
