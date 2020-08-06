import { showInfo, showError } from '../notification.js';
import { createMovie, getMovies, buyTicket as apiBuyTicket, getMovieByOwner, getMovieById, updateMovie, deleteMovie as apiDelete, getMovieCount } from '../data.js';


export default async function catalog() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        paging: await this.load('./templates/common/paging.hbs'),
        movie: await this.load('./templates/movie/movie.hbs'),
    };

    const page = this.params.page || 1;
    const search = this.params.search || '';
    const movieCount = await getMovieCount(search);
    const pageCount = Math.ceil(movieCount / 9);

    const movies = await getMovies(search, page);
    this.app.userData.movies = movies;
    const context = Object.assign({ origin: encodeURIComponent('#/catalog'), search }, this.app.userData);
    context.paging = (new Array(pageCount)).fill(null).map((p, i) => ({number: i+1, current: page == (i+1)}));

    this.partial('./templates/movie/catalog.hbs', context);
}

export async function myMovies() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        movie: await this.load('./templates/movie/movie.hbs'),
        ownMovie: await this.load('./templates/movie/ownMovie.hbs')
    };

    const movies = await getMovieByOwner();
    this.app.userData.movies = movies;

    const context = Object.assign({ myMovies: true, origin: encodeURIComponent('#/my_movies') }, this.app.userData);

    this.partial('./templates/movie/catalog.hbs', context);
}

export async function create() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    this.partial('./templates/movie/create.hbs', this.app.userData);
}

export async function createPost() {
    try {
        if (this.params.title.length === 0) {
            throw new Error('Title is required');
        }

        const movie = {
            title: this.params.title,
            image: this.params.image,
            description: this.params.description,
            genres: this.params.genres,
            tickets: Number(this.params.tickets)
        };

        const result = await createMovie(movie);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Movie created');
        this.redirect('#/details/' + result.objectId);
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

export async function details() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    const movieId = this.params.id;
    let movie = this.app.userData.movies.find(m => m.objectId == movieId);
    if (movie === undefined) {
        movie = await getMovieById(movieId);
    }

    const context = Object.assign({ movie, origin: encodeURIComponent('#/details/' + movieId) }, this.app.userData);

    this.partial('./templates/movie/details.hbs', context);
}

export async function edit() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    const movieId = this.params.id;

    let movie = this.app.userData.movies.find(m => m.objectId == movieId);
    if (movie === undefined) {
        movie = await getMovieById(movieId);
    }
    const context = Object.assign({ movie }, this.app.userData);

    this.partial('./templates/movie/edit.hbs', context);
}

export async function editPost() {
    const movieId = this.params.id;

    try {
        if (this.params.title.length === 0) {
            throw new Error('Title is required');
        }

        const movie = {
            title: this.params.title,
            image: this.params.image,
            description: this.params.description,
            genres: this.params.genres,
            tickets: Number(this.params.tickets)
        };

        const result = await updateMovie(movieId, movie);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        for (let i = 0; i < this.app.userData.movies.length; i++) {
            if (this.app.userData.movies[i].objectId == movieId) {
                this.app.userData.movies.splice(i, 1);
            }
        }

        showInfo('Movie edited');
        this.redirect('#/details/' + result.objectId);
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

export async function buyTicket() {
    const movieId = this.params.id;

    let movie = this.app.userData.movies.find(m => m.objectId == movieId);
    if (movie === undefined) {
        movie = await getMovieById(movieId);
    }

    try {
        const result = await apiBuyTicket(movie);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo(`Bought ticket for ${movie.title}`);

        this.redirect(this.params.origin);
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

export async function deleteMovie() {
    if (confirm('Are you sure you want to delete this movie?') == false) {
        return this.redirect('#/my_movies');
    }

    const movieId = this.params.id;

    try {
        const result = await apiDelete(movieId);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Move deleted');

        this.redirect('#/my_movies');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}