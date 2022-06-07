package com.example.myapplication32.models.shipments

import com.google.gson.annotations.SerializedName

data class ShipmentsToDelevredResponse(
    @SerializedName("id")
    var id: Int,

    @SerializedName("tracking")
    var tracking: String

)
