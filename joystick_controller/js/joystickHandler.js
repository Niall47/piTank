class JoystickHandler {
    constructor() {
        this.algorithm = 'diffsteer';
        this.intervalID = null;
        this.Joy = null;
        this.lastMotorValues = { left: 0, right: 0 };
        
        // DOM references
        this.elements = {
            refreshRateText: document.getElementById("refreshRateText"),
            direction: document.getElementById("direction"),
            driveValues: document.getElementById("driveValues"),
            refreshRate: document.getElementById("refreshRate")
        };
        
        this.initializeJoystick();
        this.setInitialAlgorithm();
    }
    
    initializeJoystick() {
        const joyParam = {
            "title": "joystick",
            "width": 300,
            "height": 300
        };
        this.Joy = new JoyStick('joyDiv', joyParam);
        
        // Set global reference for backward compatibility
        if (typeof window !== 'undefined') {
            window.Joy = this.Joy;
        }
    }
    
    setInitialAlgorithm() {
        const selected = document.querySelector('input[name="algorithm"]:checked');
        if (selected) {
            this.algorithm = selected.id;
        }
        // Set global for backward compatibility
        if (typeof window !== 'undefined') {
            window.algorithm = this.algorithm;
        }
    }
    
    getDirection() {
        if (!this.Joy) return { X: 0, Y: 0 };
        
        try {
            const joyX = this.Joy.GetX();
            const joyY = this.Joy.GetY();
            return {
                X: parseInt(joyX) || 0,
                Y: parseInt(joyY) || 0
            };
        } catch (error) {
            console.error('Error reading joystick values:', error);
            return { X: 0, Y: 0 };
        }
    }
    
    getMotorInputs(x, y) {
        // Validate inputs
        x = Math.max(-100, Math.min(100, x || 0));
        y = Math.max(-100, Math.min(100, y || 0));
        
        try {
            switch (this.algorithm) {
                case "compass":
                    return compass(x, y);
                case "diffsteer":
                    return diffSteer(x, y);
                case "experimental":
                    return experimental(x, y);
                default:
                    console.warn(`Unknown algorithm: ${this.algorithm}`);
                    return { left: 0, right: 0 };
            }
        } catch (error) {
            console.error('Error calculating motor inputs:', error);
            return { left: 0, right: 0 };
        }
    }
    
    setAlgorithm(algorithmName) {
        if (['compass', 'diffsteer', 'experimental'].includes(algorithmName)) {
            this.algorithm = algorithmName;
            // Update global for backward compatibility
            if (typeof window !== 'undefined') {
                window.algorithm = algorithmName;
            }
            sendLog(`Changed to ${algorithmName}`);
        } else {
            console.error(`Invalid algorithm: ${algorithmName}`);
        }
    }
    
    updateFromRadioButton() {
        const selected = document.querySelector('input[name="algorithm"]:checked');
        if (selected) {
            this.setAlgorithm(selected.id);
        }
    }
    
    startInterval() {
        this.stopInterval();
        
        const refreshRate = parseInt(this.elements.refreshRate.value) || 100;
        
        this.intervalID = setInterval(() => {
            try {
                const directions = this.getDirection();
                const motorInputs = this.getMotorInputs(directions.X, directions.Y);
                
                // Only update displays and send data if values changed
                if (this.hasMotorValuesChanged(motorInputs)) {
                    this.updateDisplays(directions, motorInputs);
                    
                    if (typeof connectionStatus !== 'undefined' && connectionStatus === 'Connected') {
                        const payload = JSON.stringify(motorInputs);
                        if (typeof sendPayload === 'function') {
                            sendPayload(payload);
                        }
                    }
                    
                    this.lastMotorValues = { ...motorInputs };
                }
                
                // Always update visualizer for smooth feedback
                updateCanvas(motorInputs.right, 'rightTrack');
                updateCanvas(motorInputs.left, 'leftTrack');
                
            } catch (error) {
                console.error('Error in interval update:', error);
            }
        }, refreshRate);
        
        this.elements.refreshRateText.textContent = `Refresh rate: ${refreshRate} ms`;
    }
    
    hasMotorValuesChanged(newValues) {
        return newValues.left !== this.lastMotorValues.left || 
               newValues.right !== this.lastMotorValues.right;
    }
    
    updateDisplays(directions, motorInputs) {
        try {
            this.elements.driveValues.innerHTML = JSON.stringify(motorInputs);
            this.elements.direction.innerHTML = JSON.stringify(directions);
        } catch (error) {
            console.error('Error updating displays:', error);
        }
    }
    
    stopInterval() {
        if (this.intervalID) {
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    }
    
    updateRefreshRate() {
        this.startInterval();
    }
}

// Global instance
let joystickHandler = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all DOM elements are ready
    setTimeout(() => {
        joystickHandler = new JoystickHandler();
        joystickHandler.startInterval();
    }, 100);
});

// Global functions for backward compatibility
function changeSteeringAlgorithm() {
    if (joystickHandler) {
        joystickHandler.updateFromRadioButton();
    }
}

function rateUpdate() {
    if (joystickHandler) {
        joystickHandler.updateRefreshRate();
    }
}
