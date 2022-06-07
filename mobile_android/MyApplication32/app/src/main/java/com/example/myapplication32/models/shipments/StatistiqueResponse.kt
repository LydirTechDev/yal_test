package com.example.myapplication32.models.shipments

import com.google.gson.annotations.SerializedName

data class StatistiqueResponse(
    @SerializedName("total")
    val total: Number,

    @SerializedName("echec")
    val echec: Number,

    @SerializedName("livre")
    val livre: Float,

    @SerializedName("echange")
    val echange: Number,

    @SerializedName("enAttente")
    val enAttente: Number,

    @SerializedName("montant")
    val montant: Float,

    @SerializedName("gain")
    val gain: Float,
)
