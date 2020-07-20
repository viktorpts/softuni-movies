/* globals Sammy */

window.addEventListener('load', () => {
    const app = Sammy('#container', function() {
        this.use('Handlebars', 'hbs');

        this.get('/', home);
        this.get('index.html', home);
        this.get('#/home', home);
    });

    app.run();

    async function home() {
        this.partials = {
            header: await this.load('./templates/common/header.hbs'),
            footer: await this.load('./templates/common/footer.hbs')
        };

        this.partial('./templates/home.hbs');
    }
});