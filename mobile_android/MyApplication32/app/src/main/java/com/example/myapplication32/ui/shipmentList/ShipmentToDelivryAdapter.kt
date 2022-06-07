package com.example.myapplication32.ui.shipmentList

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.myapplication32.R
import com.example.myapplication32.models.shipments.ShipmentsToDelevredResponse

class ShipmentToDelivryAdapter: RecyclerView.Adapter<ShipmentToDelivryAdapter.MyViewHolder>() {

    private var shipmentList = emptyList<ShipmentsToDelevredResponse>()

    class MyViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val cardView = itemView.findViewById(R.id.card) as CardView
        val trackingView = cardView.findViewById(R.id.tracking) as TextView
        val indexView = cardView.findViewById(R.id.index) as TextView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        return MyViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.shipment_to_delivry_item, parent ,false))
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val currentItem = shipmentList[position]
        holder.cardView.tag = position
        holder.trackingView.text = currentItem.tracking
        holder.indexView.text = (position+1).toString()
        holder.cardView.setOnClickListener {
            Log.i("click", "test:${currentItem.tracking}")
            val action = ShipmentListFragmentDirections.actionShipmentListToDetailShipment(currentItem.tracking)
            holder.itemView.findNavController().navigate(action)
        }
    }

    override fun getItemCount(): Int {
        return shipmentList.size
    }

    fun setData(x: List<ShipmentsToDelevredResponse> ) {
        this.shipmentList = x
        notifyDataSetChanged()
    }

}