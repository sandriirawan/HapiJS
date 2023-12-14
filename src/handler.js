const { v4: uuidv4 } = require("uuid");
const books = require('./notes')


const createBookHandler = (request, h) => {
    try {
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = request.payload;

        if (!name) {
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            }).code(400);
        }

        const id = uuidv4();
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished: pageCount === readPage,
            insertedAt,
            updatedAt,
        };

        books.push(newBook)

        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'error',
            message: 'Terjadi suatu kesalahan pada server',
        }).code(500);
    }
};


const getAllBooksHandler = async (request, h) => {
    try {
        const { name, reading, finished } = request.query;

        let filteredBooks = books;

        if (name) {
            const lowerCaseName = name.toLowerCase();
            filteredBooks = filteredBooks.filter(book =>
                book.name.toLowerCase().includes(lowerCaseName)
            );
        }

        if (reading !== undefined) {
            const isReading = reading === '1';
            filteredBooks = filteredBooks.filter(book => book.reading === isReading);
        }

        if (finished !== undefined) {
            const isFinished = finished === '1';
            filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
        }

        const simplifiedBooks = filteredBooks.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));

        return h.response({
            status: 'success',
            data: {
                books: simplifiedBooks,
            },
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'error',
            message: 'Terjadi suatu kesalahan pada server',
        }).code(500);
    }
};



const getDetailBookHandler = async (request, h) => {
    try {
        const { bookId } = request.params;

        const book = books.find(book => book.id === bookId);

        if (!book) {
            return h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan',
            }).code(404);
        }

        const response = {
            status: 'success',
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.finished,
                    reading: book.reading,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt,
                },
            },
        };

        return h.response(response).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'error',
            message: 'Terjadi suatu kesalahan pada server',
        }).code(500);
    }
};

const updateBookHandler = async (request, h) => {
    try {
        const { bookId } = request.params;
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = request.payload;

        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex === -1) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan',
            }).code(404);
        }

        if (!name) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            }).code(400);
        }

        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt: new Date().toISOString(),
        };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'error',
            message: 'Terjadi suatu kesalahan pada server',
        }).code(500);
    }
};


const deleteBookHandler = async (request, h) => {
    try {
        const { bookId } = request.params;

        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex === -1) {
            return h.response({
                status: 'fail',
                message: 'Buku gagal dihapus. Id tidak ditemukan',
            }).code(404);
        }

        books.splice(bookIndex, 1);

        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'error',
            message: 'Terjadi suatu kesalahan pada server',
        }).code(500);
    }
};

module.exports = {
    createBookHandler,
    getAllBooksHandler,
    getDetailBookHandler,
    updateBookHandler,
    deleteBookHandler,
};
