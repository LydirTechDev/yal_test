package com.example.myapplication32

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.myyalidinefreelance.models.auth.LoginRequest
import com.example.myyalidinefreelance.models.auth.LoginResponse
import com.example.myyalidinefreelance.services.ApiClient
import com.example.myyalidinefreelance.services.SessionManager
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager
    private lateinit var apiClient: ApiClient
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        supportActionBar?.hide()
        setContentView(R.layout.activity_main)

        apiClient = ApiClient()
        sessionManager = SessionManager(this)

        findViewById<Button>(R.id.button).setOnClickListener {
            val emailInput = findViewById<TextInputEditText>(R.id.email_input)
            val mdpInput = findViewById<TextInputEditText>(R.id.password_input)

            val email: String = emailInput.text.toString()
            val mdp: String = mdpInput.text.toString()
            Log.i("MainActivity", "email:$email | password: $mdp")
            if (email.isNotEmpty() && mdp.isNotEmpty()) {
                Log.i("MainActivity", "email:$email | password: $mdp")
                apiClient.getApiService(this).login(LoginRequest(email, mdp))
                    .enqueue(object : Callback<LoginResponse> {
                        override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                            // Error logging in
                            Log.i("MainActivity", "Error de connexion ...")
                        }

                        override fun onResponse(
                            call: Call<LoginResponse>,
                            response: Response<LoginResponse>
                        ) {
                            val loginResponse = response.body()
                            Log.i("MainActivity", loginResponse.toString())
                            if (loginResponse != null) {
                                sessionManager.saveAuthToken(
                                    loginResponse.authToken,
                                    loginResponse.user
                                )
                                Log.i("MainActivity", "user : ${loginResponse.user}")
                                if (loginResponse.user.typeUser == "42659985") {
                                    goHome()
                                }
                            }
                        }
                    })
            }
        }
    }

    fun goHome() {
        val intent = Intent(this, NaveActivity::class.java)
        startActivity(intent)
    }

}