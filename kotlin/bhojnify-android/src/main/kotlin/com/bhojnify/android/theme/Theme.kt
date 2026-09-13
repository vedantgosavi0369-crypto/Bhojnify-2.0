package com.bhojnify.android.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

data class BhojnifyColors(
    val primary: Color,
    val primaryForeground: Color,
    val secondary: Color,
    val secondaryForeground: Color,
    val background: Color,
    val foreground: Color,
    val card: Color,
    val cardForeground: Color,
    val muted: Color,
    val mutedForeground: Color,
    val accent: Color,
    val accentForeground: Color,
    val destructive: Color,
    val destructiveForeground: Color,
    val border: Color,
    val input: Color
)

val LocalBhojnifyColors = staticCompositionLocalOf {
    BhojnifyColors(
        primary = PrimaryLight,
        primaryForeground = PrimaryForegroundLight,
        secondary = SecondaryLight,
        secondaryForeground = SecondaryForegroundLight,
        background = BackgroundLight,
        foreground = ForegroundLight,
        card = CardLight,
        cardForeground = CardForegroundLight,
        muted = MutedLight,
        mutedForeground = MutedForegroundLight,
        accent = AccentLight,
        accentForeground = AccentForegroundLight,
        destructive = DestructiveLight,
        destructiveForeground = DestructiveForegroundLight,
        border = BorderLight,
        input = InputLight
    )
}

@Composable
fun BhojnifyTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val customColors = if (darkTheme) {
        BhojnifyColors(
            primary = PrimaryDark,
            primaryForeground = PrimaryForegroundDark,
            secondary = SecondaryDark,
            secondaryForeground = SecondaryForegroundDark,
            background = BackgroundDark,
            foreground = ForegroundDark,
            card = CardDark,
            cardForeground = CardForegroundDark,
            muted = MutedDark,
            mutedForeground = MutedForegroundDark,
            accent = AccentDark,
            accentForeground = AccentForegroundDark,
            destructive = DestructiveDark,
            destructiveForeground = DestructiveForegroundDark,
            border = BorderDark,
            input = InputDark
        )
    } else {
        BhojnifyColors(
            primary = PrimaryLight,
            primaryForeground = PrimaryForegroundLight,
            secondary = SecondaryLight,
            secondaryForeground = SecondaryForegroundLight,
            background = BackgroundLight,
            foreground = ForegroundLight,
            card = CardLight,
            cardForeground = CardForegroundLight,
            muted = MutedLight,
            mutedForeground = MutedForegroundLight,
            accent = AccentLight,
            accentForeground = AccentForegroundLight,
            destructive = DestructiveLight,
            destructiveForeground = DestructiveForegroundLight,
            border = BorderLight,
            input = InputLight
        )
    }

    val materialColorScheme = if (darkTheme) {
        darkColorScheme(
            primary = customColors.primary,
            background = customColors.background,
            surface = customColors.card
        )
    } else {
        lightColorScheme(
            primary = customColors.primary,
            background = customColors.background,
            surface = customColors.card
        )
    }

    CompositionLocalProvider(LocalBhojnifyColors provides customColors) {
        MaterialTheme(
            colorScheme = materialColorScheme,
            typography = Typography,
            content = content
        )
    }
}

object BhojnifyTheme {
    val colors: BhojnifyColors
        @Composable
        get() = LocalBhojnifyColors.current
}
