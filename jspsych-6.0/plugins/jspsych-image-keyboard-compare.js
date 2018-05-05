/**
 * jspsych-image-keyboard-compare
 * Shaoaliang
 *
 * plugin for comparing two images and getting a keyboard response
 *
 * 
 *
 **/


jsPsych.plugins["image-keyboard-compare"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-keyboard-compare', 'stimulus_1', 'image');
  jsPsych.pluginAPI.registerPreload('image-keyboard-compare', 'stimulus_2', 'image');

  plugin.info = {
    name: 'image-keyboard-compare',
    description: '',
    parameters: {
      stimulus_1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'stimulus-1',
        default: undefined,
        description: 'The first image to be displayed'
      },
      stimulus_2: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'stimulus-1',
        default: undefined,
        description: 'The second image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    var randn = Math.floor(Math.random() * 2);
    var first = randn == 0 ? trial.stimulus_1 : trial.stimulus_2, 
        second = randn == 0 ? trial.stimulus_2 : trial.stimulus_1;
    var image_html = '<img src="'+ first + '" id="jspsych-image-keyboard-compare-stimulus-1"></img>' + '<img src="'+ second + '" id="jspsych-image-keyboard-compare-stimulus-2"></img>';
    image_html += '<div id="first_div"></div>' + '<div id="second_div"></div>';

    // add prompt
    if (trial.prompt !== null){
      image_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = image_html;

    // position elements
    var image_dist = 50, image_res = 256;
    var margin = (window.innerWidth - image_res * 2 - image_dist) / 2,
        top = window.innerHeight / 4; 
    var elm1 = display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-1'),
        elm2 = display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-2'),
        div1 = display_element.querySelector('#first_div'),
        div2 = display_element.querySelector('#second_div');

    elm1.style.position = 'absolute';
    elm1.style.left = margin + "px";
    elm1.style.top = top + "px";
    elm2.style.position = 'absolute';
    elm2.style.right = margin + "px";
    elm2.style.top = top + "px";

    var divHeight = 6;
    div1.style.position = 'absolute';
    div1.style.left = margin + "px";
    div1.style.top = top + image_res + "px";
    div1.style.width = image_res + 'px';
    div1.style.height = divHeight + 'px';
    div1.style.backgroundColor = 'red';
    div1.style.visibility = 'hidden';

    div2.style.position = 'absolute';
    div2.style.right = margin + "px";
    div2.style.top = top + image_res + "px";
    div2.style.width = image_res + 'px';
    div2.style.height = divHeight + 'px';
    div2.style.backgroundColor = 'red';
    div2.style.visibility = 'hidden';

    var textElm = display_element.querySelector('p');
    textElm.style.position = 'absolute';
    textElm.style.left = margin + image_res / 12 + "px";
    textElm.style.top = top + image_res + 20 + "px";

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "first_image": first,
        "second_image": second,
        "rt": response.rt,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded

      // keycode 49: keyboard '1'
      // keycode 50: keyboard '2'
      // keycode 32: keyboard ' '

      if (info.key == 49) {
        div1.style.visibility = 'visible';
        div2.style.visibility = 'hidden';
      } else if (info.key == 50) {
        div2.style.visibility = 'visible';
        div1.style.visibility = 'hidden';
      }

      if (info.key == 49 || info.key == 50) {
        response = info;
      }

      if (response.key && info.key == 32) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: true,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        elm1.style.visibility = 'hidden';
        elm2.style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
