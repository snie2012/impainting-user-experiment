/*
 * html timer
 */

jsPsych.plugins["html-timer"] = (function() {

  var plugin = {};
  
  plugin.info = {
    name: "html-timer",
    parameters: {
      total_time: {
        type: jsPsych.plugins.parameterType.INT, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
        default_value: undefined
      },
      message: {
        type: jsPsych.plugins.parameterType.STRING,
        default_value: "You have reached the end of the end of the experiment. Please keep this page open for a while to allow the data to be transmitted to the server. Once the clock below counts to 0, you can close the page. Thank you for participating."
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var seconds_left = trial.total_time;
    var html = '<div id="timer_div" style="font-size:50px;color:blue">' + seconds_left + '</div>';
    html += '</br>'
    html += '<div>' + trial.message + '</div>';
    display_element.innerHTML = html;

    var interval = setInterval(function() {
        display_element.querySelector('#timer_div').innerHTML = --seconds_left;

        if (seconds_left <= 0)
        {
            display_element.querySelector('#timer_div').innerHTML = 'Now you can close the page';
            clearInterval(interval);
        }
    }, 1000);

    // data saving
    var trial_data = {};
  };

  return plugin;
})();
