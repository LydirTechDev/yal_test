package com.example.myapplication32.ui.detailShipment

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.myapplication32.databinding.FragmentDetailShipmentBinding
import com.example.myapplication32.models.shipments.InfoOneShipmentRequest
import com.example.myapplication32.models.shipments.InfoShipmentToDelevredResponse
import com.example.myyalidinefreelance.services.ApiClient
import com.example.myyalidinefreelance.services.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.NumberFormat
import java.util.*


class DetailShipment : Fragment() {
    private val args by navArgs<DetailShipmentArgs>()

    private lateinit var sessionManager: SessionManager
    private lateinit var apiClient: ApiClient
    private var _binding: FragmentDetailShipmentBinding? = null
    private val binding get() = _binding!!

    private var shipment: InfoShipmentToDelevredResponse? = null

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val detailShipmentViewModel =
            ViewModelProvider(this)[DetailShipmentViewModel::class.java]

        // Inflate the layout for this fragment
        _binding = FragmentDetailShipmentBinding.inflate(inflater, container, false)
        val root: View = binding.root

        apiClient = ApiClient()
        sessionManager = SessionManager(root.context)

        val number = 10000000
        val str: String = NumberFormat.getNumberInstance(Locale.US).format(number)
        binding.tarif?.text = "$str DA"

        detailShipmentViewModel.shipment.observe(viewLifecycleOwner) {
            shipment = it;
            Log.i("info", "------------observe---> :${it}")
        }

        if (args.currentShipmentTracking != null) {
            apiClient.getApiService(root.context)
                .getOneShipmentToBeDelivered(InfoOneShipmentRequest(args.currentShipmentTracking))
                .enqueue(object : Callback<InfoShipmentToDelevredResponse> {
                    override fun onResponse(
                        call: Call<InfoShipmentToDelevredResponse>,
                        response: Response<InfoShipmentToDelevredResponse>
                    ) {
                        Log.i("info", "SUCCESS --> :${response.body()}")
                        response.body()?.let { detailShipmentViewModel.setNewShipment(it) }
                        binding.idTracking.text = response.body()?.tracking
                        binding.idNomDest.text = response.body()?.nom_dest
                        binding.idPrenomDest.text = response.body()?.prom_dest
                        binding.idNumTelDest.text = response.body()?.telephone_dest
                        binding.idAdrDest.text = response.body()?.address_dest
                        binding.idNomExp?.text = response.body()?.nom_exp
                        binding.idPrenomExp?.text = response.body()?.prom_exp
                        binding.idNumTelExp?.text = response.body()?.telephone_exp
                        binding.idAdrExp?.text = response.body()?.address_exp
                        val number = response.body()?.tarif?.toFloat()
                        val str: String = NumberFormat.getNumberInstance(Locale.US).format(number)
                        binding.tarif?.text = "$str DA"
                    }

                    override fun onFailure(
                        call: Call<InfoShipmentToDelevredResponse>,
                        t: Throwable
                    ) {
                        Log.i("info", "ERROR !!!--> :${t}")
                    }
                })
        }
        binding.btnCall.setOnClickListener {
            Log.i("info", "--------CALL !!!--> :${shipment?.telephone_dest?.trim()}")
            if (ContextCompat.checkSelfPermission(
                    root.context,
                    android.Manifest.permission.CALL_PHONE
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                this.activity?.let { it1 ->
                    ActivityCompat.requestPermissions(
                        it1,
                        arrayOf(android.Manifest.permission.CALL_PHONE),
                        1
                    )
                }
            } else {
                var dial: String = "tel:" + shipment?.telephone_dest?.trim()
                val intent = Intent(Intent.ACTION_CALL, Uri.parse(dial))
                root.context?.startActivity(intent)
            }
        }
        binding.btnLivrer.setOnClickListener {
            Log.i("liver", "CLICK !!!-->")
            shipment?.let { it1 ->
                apiClient.getApiService(root.context)
                    .setShipmentLivre(InfoOneShipmentRequest(it1.tracking))
                    .enqueue(object : Callback<InfoShipmentToDelevredResponse> {
                        override fun onResponse(
                            call: Call<InfoShipmentToDelevredResponse>,
                            response: Response<InfoShipmentToDelevredResponse>
                        ) {
                            Log.i("liver", "onResponse !!!-->")
                            if (response.body() != null) {
                                val action = shipment?.tracking?.let { it1 ->
                                    DetailShipmentDirections.actionDetailShipmentToShipmentList(
                                        it1
                                    )
                                }
                                if (action != null) {
                                    findNavController().navigate(action)
                                }
                            }
                        }

                        override fun onFailure(
                            call: Call<InfoShipmentToDelevredResponse>,
                            t: Throwable
                        ) {
                            Log.i("liver", "ERROR !!!--> :${t}")
                        }
                    })
            }
        }
        binding.btnAlert.setOnClickListener {
            var dialogAlert = AlertShipmentFragment()
            dialogAlert.show(this.parentFragmentManager, "customDialogAlert")
        }
        binding.btnFaile.setOnClickListener {
            var dialogEchec = EchecShipmentFragment()
            dialogEchec.show(this.parentFragmentManager, "customDialogEchec")
        }
        return root
    }

}