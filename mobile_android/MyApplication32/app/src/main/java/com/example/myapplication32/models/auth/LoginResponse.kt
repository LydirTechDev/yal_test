package com.example.myyalidinefreelance.models.auth

import com.example.myyalidinefreelance.models.User
import com.google.gson.annotations.SerializedName

data class LoginResponse(
    @SerializedName("access_token")
    var authToken: String,

    @SerializedName("user")
    var user: User
)
