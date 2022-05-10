package com.example.myapplication32.ui.pickup

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class PickupViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "Scanner les colis à ramasser"
    }
    val text: LiveData<String> = _text

}