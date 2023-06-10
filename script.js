new Vue({
  el: '#app',
  data() {
    return {
      gamepad: null,
      magnitude: 0,
      duration: 700,
      activeButton: null
    }
  },
  created() {
    const pollGamepads = setInterval(() => {
      const gamepad = navigator.getGamepads()[0]
      console.log(gamepad)
      if (gamepad) {
        this.gamepad = gamepad
        clearInterval(pollGamepads)
      }
    }, 400)
  },
  methods: {
    toggleGo(buttonType) {
      if (this.activeButton === buttonType) {
        this.activeButton = null;
        this.stopVibration();
      } else {
        this.activeButton = buttonType;
        this.startVibration();
      }
    },

    startVibration() {
      this.magnitude = this.activeButton === 'Random'
        ? Math.floor(Math.random() * 101)
        : this.magnitude;

      this.gamepad.vibrationActuator
        .playEffect('dual-rumble', {
          duration: this.duration,
          strongMagnitude: this.magnitude / 100,
          weakMagnitude: this.magnitude / 100
        })
        .then(() => {
          if (this.activeButton) {
            this.startVibration();
          }
        })
        .catch(err => console.log(err));
    },

    stopVibration() {
      this.gamepad.vibrationActuator.reset();
    },

    getButtonLabel(buttonType) {
      return this.activeButton === buttonType ? 'Stop' : buttonType;
    },

    setDefaultValues() {
      this.magnitude = 0;
      this.duration = 700;
    }
  }
});
