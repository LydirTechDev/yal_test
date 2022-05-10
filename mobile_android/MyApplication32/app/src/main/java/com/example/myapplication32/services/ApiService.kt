package com.example.myapplication32.services


import com.example.myyalidinefreelance.models.auth.LoginRequest
import com.example.myyalidinefreelance.models.auth.LoginResponse
import com.example.myyalidinefreelance.models.pickup.PickupResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {

    object Constants {
        // Endpoints
        const val BASE_URL = "https://api.yalidineapps.com"
        const val LOGIN_URL = "auth/login"
        const val POSTS_URL = "posts"
        const val GET_PICKUP_SHIPMENTS_URL = "shipments/getPickupFreelance"
    }

    @POST(Constants.LOGIN_URL)
    fun login(@Body request: LoginRequest): Call<LoginResponse>

    @GET(Constants.GET_PICKUP_SHIPMENTS_URL)
    fun getShipmentsPickupPresExpedition(): Call<Array<String?>>
}