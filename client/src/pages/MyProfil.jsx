/*
.get("/user/:userId", getOrdersByUserId);



{

[
    {
        "_id": "683999e0c5dfe94962216277",
        "userId": "682a06ffdfc23601561ddfb7",
        "numeroPhone": 21658699003,
        "items": [
            {
                "productId": "682c82d8d71bca7170c7b3c8",
                "name": "h,",
                "price": 2,
                "size": "Kilogramme",
                "quantity": 1
            },
            {
                "productId": "682cd5b3993d778758498e7f",
                "name": "ejfkr123",
                "price": 4,
                "size": "Kilogramme",
                "quantity": 2
            }
        ],
        "amount": 10,
        "amount_livraison": 0,
        "address": "54196",
        "typeLivraison": "par toi meme",
        "livreurId": "waiting",
        "status": "Order Placed",
        "paymentMethod": "à livraison",
        "paymentStatut": "waiting",
        "date": "2025-05-30T11:43:28.651Z",
        "__v": 0
    },
    {
        "_id": "68399a3bc5dfe94962216291",
        "userId": "682a06ffdfc23601561ddfb7",
        "numeroPhone": 21658699003,
        "items": [
            {
                "productId": "682c82d8d71bca7170c7b3c8",
                "name": "h,",
                "price": 2,
                "size": "Kilogramme",
                "quantity": 1
            },
            {
                "productId": "682cd5b3993d778758498e7f",
                "name": "ejfkr123",
                "price": 4,
                "size": "Kilogramme",
                "quantity": 2
            },
            {
                "productId": "682c80edd71bca7170c7b3bd",
                "name": "gbfb",
                "price": 4,
                "size": "Kilogramme",
                "quantity": 3
            }
        ],
        "amount": 22,
        "amount_livraison": 0,
        "address": "hfhgh",
        "typeLivraison": "par toi meme",
        "livreurId": "waiting",
        "status": "Order Placed",
        "paymentMethod": "à livraison",
        "paymentStatut": "waiting",
        "date": "2025-05-30T11:44:59.823Z",
        "__v": 0
    },


}










livreurRouter.get("/by-user/:userId", getLivreurByUserId);
{

{
    "success": true,
    "message": "Livreur retrieved successfully",
    "data": {
        "_id": "6839c423952d63527b10e777",
        "userId": "682a06ffdfc23601561ddfb7",
        "documents": [
            "https://res.cloudinary.com/dad5aaqpd/image/upload/v1748616225/Document/nkdxkoqqvffsik0mxw9f.png",
            "https://res.cloudinary.com/dad5aaqpd/image/upload/v1748616226/Document/ytysasfpi2ghyuvlxpac.png",
            "https://res.cloudinary.com/dad5aaqpd/image/upload/v1748616227/Document/sgqyfznvfk5ap7sh8nm7.png"
        ],
        "VolumeDisponibleParDefaut": 4,
        "poidsMaximale": 12,
        "ordreId": "",
        "soldeavenir": 0,
        "solde": 0,
        "statutDemande": "Accepté",
        "telephone": 21658699003,
        "__v": 0,
        "citeprincipale": "bizerte"
    }
}

}


livreurRouter.patch("/update/:userId", updateLivreurProfile);


orderrouter.get("/orders/:livreurId", getOrdersByLivreurId);













*/