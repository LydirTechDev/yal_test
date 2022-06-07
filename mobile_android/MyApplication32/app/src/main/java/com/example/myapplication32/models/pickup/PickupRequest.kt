package com.example.myapplication32.models.pickup

import com.google.gson.annotations.SerializedName

data class PickupRequest(
    @SerializedName("tracking")
    var tracking: ArrayList<String>?,
) {

}
