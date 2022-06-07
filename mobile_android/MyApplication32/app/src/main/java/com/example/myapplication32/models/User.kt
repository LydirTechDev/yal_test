package com.example.myyalidinefreelance.models

import com.google.gson.annotations.SerializedName

data class User(

    @SerializedName("id")
    var id: String,

    @SerializedName("email")
    var email: String,

    @SerializedName("typeUser")
    var typeUser: String,
)
