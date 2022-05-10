package com.example.myapplication32

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedViewModel: ViewModel() {

    val codelive = MutableLiveData<String>().apply {
        value = ""
    }
    public fun setNewCode(x: String) {
        codelive.value  = x
    }
    val code: LiveData<String> = codelive

    private val _shipmentsForPickup = MutableLiveData<MutableList<String?>>().apply {
        value = mutableListOf("")
    }
    val shipmentsForPickup: LiveData<MutableList<String?>> = _shipmentsForPickup

    public fun addNewShipments(x: String) {
        shipmentsForPickup.value?.add(x)
    }
    public fun resetShipments(){
        shipmentsForPickup.value?.clear()
    }
}