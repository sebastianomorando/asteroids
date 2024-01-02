class Controls {

    forward: boolean = false;
    backward: boolean = false;
    left: boolean = false;
    right: boolean = false;

    constructor() {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'w':
                this.forward = true;
                break;
            case 's':
                this.backward = true;
                break;
            case 'a':
                this.left = true;
                break;
            case 'd':
                this.right = true;
                break;
        }
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case 'w':
                this.forward = false;
                break;
            case 's':
                this.backward = false;
                break;
            case 'a':
                this.left = false;
                break;
            case 'd':
                this.right = false;
                break;
        }
    }

    destroy() {
        document.removeEventListener('keydown', this.onKeyDown.bind(this));
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
    }
}

export default Controls;