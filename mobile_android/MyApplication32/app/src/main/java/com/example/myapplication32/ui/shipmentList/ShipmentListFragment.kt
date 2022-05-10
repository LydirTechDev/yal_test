package com.example.myapplication32.ui.shipmentList

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import com.example.myapplication32.R
import com.example.myapplication32.SharedViewModel
import com.example.myapplication32.databinding.FragmentShipmentListBinding
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.zxing.integration.android.IntentIntegrator


class ShipmentListFragment : Fragment() {

    private var _binding: FragmentShipmentListBinding? = null
    private val sharedViewModel: SharedViewModel by activityViewModels()

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val slideshowViewModel =
            ViewModelProvider(this)[ShipmentListViewModel::class.java]

        _binding = FragmentShipmentListBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val shipmentsForPickup: TextView = binding.nbShipments
        sharedViewModel.shipmentsForPickup.observe(viewLifecycleOwner){
            shipmentsForPickup.text = it.size.toString()
        }

        root.findViewById<FloatingActionButton>(R.id.scan_package_fab1).setOnClickListener(View.OnClickListener {
            val intentIntegrator = IntentIntegrator(activity)
            intentIntegrator.setBeepEnabled(true)
            intentIntegrator.setOrientationLocked(false)
            intentIntegrator.setCameraId(0)
            intentIntegrator.setPrompt("SCAN")
            intentIntegrator.setTorchEnabled(true)
            intentIntegrator.setBarcodeImageEnabled(false)
            intentIntegrator.initiateScan()
        })

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}


