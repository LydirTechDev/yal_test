package com.example.myapplication32.ui.pickup

import android.annotation.SuppressLint
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
import com.example.myapplication32.databinding.FragmentPickupBinding
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.zxing.integration.android.IntentIntegrator

class PickupFragment : Fragment() {

    private var _binding: FragmentPickupBinding? = null
    private val sharedViewModel: SharedViewModel by activityViewModels()

    private lateinit var chipGroup: ChipGroup
    private lateinit var chip: Chip
    // This property is only valid between onCreateView and
    // onDestroyView.ViewModel
    private val binding get() = _binding!!

    private fun addChip(chipGroup: ChipGroup, code: String){
        var newChip = chip
        newChip.text = code
        newChip.isCloseIconVisible = true
        newChip.isCheckable= true
        newChip.isCheckedIconVisible= true
        newChip.setOnCloseIconClickListener {
            chipGroup.removeView(newChip)
        }
        chipGroup.addView(newChip)
    }


    @SuppressLint("ResourceType")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val chip = Chip(this.context)
        val galleryViewModel =
            ViewModelProvider(this).get(PickupViewModel::class.java)

        _binding = FragmentPickupBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.textGallery

        galleryViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }

        /**
         *
         */
        val codeList: ChipGroup = binding.codeList

        sharedViewModel.code.observe(viewLifecycleOwner) {
            if (it.isNotEmpty()){
                val newChip = chip
                newChip.text = it
                newChip.isCloseIconVisible = true
                newChip.isCheckable= true
                newChip.isCheckedIconVisible= true
                newChip.setOnCloseIconClickListener {
                    codeList.removeView(newChip)
                    sharedViewModel.codelive.value = ""
                }
                codeList.addView(newChip)
            }
        }

        /**
         * scan new shipments for pickup
         */
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
        /**
         *
         */
        return root
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

