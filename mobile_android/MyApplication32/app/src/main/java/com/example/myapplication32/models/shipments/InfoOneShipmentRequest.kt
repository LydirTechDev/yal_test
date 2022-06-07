package com.example.myapplication32.models.shipments

import com.google.gson.annotations.SerializedName

data class InfoOneShipmentRequest(
    @SerializedName("tracking")
    var tracking: String
)
