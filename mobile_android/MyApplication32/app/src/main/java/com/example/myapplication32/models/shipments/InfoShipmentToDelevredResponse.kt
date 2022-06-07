package com.example.myapplication32.models.shipments

import com.google.gson.annotations.SerializedName
import java.util.*

data class InfoShipmentToDelevredResponse(
    @SerializedName("id")
    var id: Int,

    @SerializedName("tracking")
    var tracking: String,

    @SerializedName("tarif")
    var tarif: String,

    @SerializedName("alertedAt")
    var alertedAt: Date,

    @SerializedName("nom_dest")
    var nom_dest: String,

    @SerializedName("prom_dest")
    val prom_dest: String,

    @SerializedName("telephone_dest")
    val telephone_dest: String,

    @SerializedName("address_dest")
    val address_dest: String,

    @SerializedName("nom_exp")
    var nom_exp: String,

    @SerializedName("prom_exp")
    val prom_exp: String,

    @SerializedName("telephone_exp")
    val telephone_exp: String,

    @SerializedName("address_exp")
    val address_exp: String,

    )
