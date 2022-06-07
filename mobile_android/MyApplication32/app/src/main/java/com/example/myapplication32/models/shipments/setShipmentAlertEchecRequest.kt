package com.example.myapplication32.models.shipments

import com.google.gson.annotations.SerializedName

data class setShipmentAlertEchecRequest(
    @SerializedName("tracking")
    var tracking: String,

    @SerializedName("msg")
    var msg: String
)

