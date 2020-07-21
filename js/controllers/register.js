import { register as apiRegister } from '../data.js';
import { showInfo, showError } from '../notification.js';

export default async function register() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        registerForm: await this.load('./templates/user/registerForm.hbs')
    };

    this.partial('./templates/user/register.hbs', this.app.userData);
}

export async function registerPost() {
    if (this.params.password !== this.params.repeatPassword) {
        alert('Password don\'t match');
        return;
    }
    if (this.params.username.length < 3) {
        alert('Username must be atleast 3 characters long');
        return;
    }
    if (this.params.password.length < 6) {
        alert('Password must be atleast 6 characters long');
        return;
    }

    try {
        const result = await apiRegister(this.params.username, this.params.password);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Successfully registerd');
        this.redirect('#/login');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}