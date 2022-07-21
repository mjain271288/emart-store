const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { productAddToCart, editProductQtyInCart, deleteItemFromCart, getCartItems } = require('../services/cart');
const { createProduct, searchProduct, isProductExist } = require('../services/product');
const { createUser, searchUser } = require('../services/user');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../../util/AppError');
const { getOr } = require('lodash/fp');

router.get(
    '/cartItems/:userId',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        getCartItems(req, url).then((data) => {
            const user = getOr({}, 'getUserById', data);
            const cartItems = getOr({}, 'getCartItemsByUserId', data);
            res.status(StatusCodes.OK).send({ user, cartItems });
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);

router.get(
    '/searchProduct/:filterText',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        searchProduct(req, url).then((data) => {
            res.status(StatusCodes.OK).send(data.searchProduct);
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);

router.get(
    '/searchUser/:firstName',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        searchUser(req, url).then((data) => {
            res.status(StatusCodes.OK).send(data);
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);



router.post(
    '/createUser',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        createUser(req, url).then((data) => {
            res.status(StatusCodes.OK).send(data.addUser);
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);


router.post(
    '/addToCart',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        const { productId } = req.body;
        const { checkProductIsExist } = await isProductExist({ productId }, url);
        if (!checkProductIsExist.status) {
            throw new AppError(StatusCodes.NOT_FOUND, 'sorry this product not exist.');
        }
        productAddToCart(req, url).then((data) => {
            res.status(StatusCodes.OK).send(data.addToCart);
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);

router.post(
    '/createProduct',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        createProduct(req, url).then((data) => {
            res.status(StatusCodes.OK).send(data);
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);

router.put(
    '/editQty/:productId',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        editProductQtyInCart(req, url).then((data) => {
            res.status(StatusCodes.OK).send(data.editProductQuantity);
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);

router.delete(
    '/:productId',
    asyncHandler(async (req, res) => {
        const url = process.env.GRAPHQL_END_POINT;
        deleteItemFromCart(req, url).then((data) => {
            res.status(StatusCodes.OK).send(data.deleteCardItem);
        }).catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
    }),
);

module.exports = router;