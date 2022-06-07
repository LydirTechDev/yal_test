package com.example.myapplication32.services


import android.icu.text.IDNA
import com.example.myapplication32.models.pickup.PickupRequest
import com.example.myapplication32.models.shipments.*
import com.example.myyalidinefreelance.models.auth.LoginRequest
import com.example.myyalidinefreelance.models.auth.LoginResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {

    object Constants {
        // Endpoints
        const val BASE_URL = "https://api.yalidineapps.com"
        const val LOGIN_URL = "auth/login"
        const val GET_PICKUP_SHIPMENTS_URL = "shipments/getPickupFreelance"
        const val POST_PICKUP_SHIPMENTS_URL = "shipments/setShipmentRamasser-freelance"
        const val GET_SHIPMENTS_TO_BE_DELIVERED_URL = "shipments/shipment-of-coursier-a-livrer"
        const val POST_SHIPMENTS_RECUE = "shipments/receive-shipments-coursier"
        const val POST_INFO_SHIPMENT_TO_BE_DELIVERED_URL = "shipments/one-shipment-of-coursier-a-livrer"
        const val POST_SET_SHIPMENT_LIVER = "shipments/set-shipment-status-livre"
        const val POST_SETSHIPMENT_EN_ALERT = "shipments/set-shipment-status-enAlert"
        const val POST_SETSHIPMENT_ECHEC = "shipments/set-shipment-status-echec-livraison-mob"
        const val GET_DASH_FREELANCE = "shipments/getStatistiqueShipmentCoursier"

    }

    @POST(Constants.LOGIN_URL)
    fun login(@Body request: LoginRequest): Call<LoginResponse>

    @GET(Constants.GET_PICKUP_SHIPMENTS_URL)
    fun getShipmentsPickupPresExpedition(): Call<Array<String?>>

    @POST(Constants.POST_PICKUP_SHIPMENTS_URL)
    fun setShipmentRamasser(@Body request: PickupRequest): Call<Boolean>

    @POST(Constants.POST_SHIPMENTS_RECUE)
    fun setShipmentRecue(@Body request: PickupRequest): Call<Boolean>


    @GET(Constants.GET_SHIPMENTS_TO_BE_DELIVERED_URL)
    fun getShipmentsToBeDelivered(): Call<Array<ShipmentsToDelevredResponse>>

    @POST(Constants.POST_INFO_SHIPMENT_TO_BE_DELIVERED_URL)
    fun getOneShipmentToBeDelivered(@Body request: InfoOneShipmentRequest): Call<InfoShipmentToDelevredResponse>

    @POST(Constants.POST_SET_SHIPMENT_LIVER)
    fun setShipmentLivre(@Body request: InfoOneShipmentRequest): Call<InfoShipmentToDelevredResponse>

    @POST(Constants.POST_SETSHIPMENT_EN_ALERT)
    fun setShipmentEnAlert(@Body request: setShipmentAlertEchecRequest): Call<InfoShipmentToDelevredResponse>

    @POST(Constants.POST_SETSHIPMENT_ECHEC)
    fun setShipmentEchc(@Body request: setShipmentAlertEchecRequest): Call<InfoShipmentToDelevredResponse>

    @GET(Constants.GET_DASH_FREELANCE)
    fun getStat(): Call<StatistiqueResponse>
}