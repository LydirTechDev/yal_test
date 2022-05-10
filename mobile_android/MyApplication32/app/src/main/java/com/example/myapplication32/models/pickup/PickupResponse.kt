package com.example.myyalidinefreelance.models.pickup

import com.google.gson.annotations.SerializedName

data class PickupResponse(
    @SerializedName("shipment")
    var shipments: Array<String> = arrayOf("")
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PickupResponse

        if (!shipments.contentEquals(other.shipments)) return false

        return true
    }

    override fun hashCode(): Int {
        return shipments.contentHashCode()
    }
}
