package com.example.myapplication32.ui.detailShipment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.RadioButton
import android.widget.RadioGroup
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.ViewModelProvider
import com.example.myapplication32.R
import com.example.myapplication32.models.shipments.InfoShipmentToDelevredResponse
import com.example.myapplication32.models.shipments.setShipmentAlertEchecRequest
import com.example.myyalidinefreelance.services.ApiClient
import com.example.myyalidinefreelance.services.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AlertShipmentFragment : DialogFragment() {
    private lateinit var sessionManager: SessionManager
    private lateinit var apiClient: ApiClient

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val detailShipmentViewModel =
            ViewModelProvider(this)[DetailShipmentViewModel::class.java]

        // Inflate the layout for this fragment
        var rootView: View = inflater.inflate(R.layout.fragment_alert_shipment, container, false)

        apiClient = ApiClient()
        sessionManager = SessionManager(rootView.context)

        var radioGroup = rootView.findViewById<RadioGroup>(R.id.group_alert)

        rootView.findViewById<Button>(R.id.id_btn_validate_alert).setOnClickListener {
            // Getting the checked radio button id
            // from the radio group
            val selectedOption: Int = radioGroup!!.checkedRadioButtonId

            // Assigning id of the checked radio button
            val radioButton = rootView.findViewById<RadioButton>(selectedOption)
            Log.i("radio", "------> :${radioButton.text}")

            this.apiClient.getApiService(rootView.context).setShipmentEnAlert(setShipmentAlertEchecRequest(detailShipmentViewModel.shipment.value.toString(),radioButton.text.toString())).enqueue(object : Callback<InfoShipmentToDelevredResponse> {
                override fun onResponse(
                    call: Call<InfoShipmentToDelevredResponse>,
                    response: Response<InfoShipmentToDelevredResponse>
                ) {
                    Log.i("radio", "${response.body()}")
                }

                override fun onFailure(call: Call<InfoShipmentToDelevredResponse>, t: Throwable) {
                    Log.i("radioE", "${t}")
                }

            })

        }
        rootView.findViewById<Button>(R.id.idi_btn_close_alert).setOnClickListener {
            dismiss()
        }
        return rootView
    }

}