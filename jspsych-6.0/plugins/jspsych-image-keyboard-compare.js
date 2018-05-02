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

  jsPsych.pluginAPI.registerPreload('image-keyboard-compare', 'stimulus', 'image');

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
      placeholder_1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'placeholder-1',
        default: undefined,
        description: 'The first placeholder image'
      },
      placeholder_2: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'placeholder_2',
        default: undefined,
        description: 'The second placeholder image'
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

    var new_html = '<img src="'+ trial.stimulus_1 + '" id="jspsych-image-keyboard-compare-stimulus-1"></img>' + '<img src="'+ trial.stimulus_2 + '" id="jspsych-image-keyboard-compare-stimulus-2"></img>';;

    // add prompt
    if (trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

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
        "rt": response.rt,
        "stimulus": trial.stimulus,
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
        display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-1').style.backgroundColor = 'lightgray';
        display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-2').style.backgroundColor = 'white';
      } else if (info.key == 50) {
        display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-1').style.backgroundColor = 'white';
        display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-2').style.backgroundColor = 'lightgray';
      }

      if (info.key == 49 || info.key == 50) {
        response = info;
      }

      if (response.key && info.key == 32) {
        console.log(response);
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
        // display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-1').style.visibility = 'hidden';
        // display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-2').style.visibility = 'hidden';
        display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-1').src = trial.placeholder_1;
        display_element.querySelector('#jspsych-image-keyboard-compare-stimulus-2').src = trial.placeholder_2;
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
