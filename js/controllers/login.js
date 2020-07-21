export default async function login() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        loginForm: await this.load('./templates/user/loginForm.hbs')
    };

    this.partial('./templates/user/login.hbs');
}