package com.example.myyalidinefreelance.services

import android.content.Context
import android.content.SharedPreferences
import com.example.myapplication32.R

import com.example.myyalidinefreelance.models.User

class SessionManager (context: Context) {
    companion object {
        const val USER_TOKEN = "user_token"
        const val USER_EMAIL = "user_email"
        const val USER_NAME = "user_name"
    }

    private var prefs: SharedPreferences = context.getSharedPreferences(context.getString(R.string.app_name), Context.MODE_PRIVATE)

    fun saveAuthToken(token: String, user: User) {
        val editor = prefs.edit()
        editor.putString(USER_TOKEN, token)
        editor.putString(USER_EMAIL, user.email)
        // editor.putString(USER_NAME, user.nom)
        editor.apply()
    }

    fun fetchAuthToken(): String? {
        return prefs.getString(USER_TOKEN, null)
    }

    fun fetchUserEmail(): String? {
        return prefs.getString(USER_EMAIL, null)
    }

}