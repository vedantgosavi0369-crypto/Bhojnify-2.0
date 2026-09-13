package com.bhojnify.core.i18n

import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class I18nTest {

    @Test
    fun `test english translation with variable substitution`() {
        val result = I18n.translate(Language.EN, "goodMorning", mapOf("name" to "Ketan"))
        assertEquals("Good morning, Ketan", result)
    }

    @Test
    fun `test marathi translation with variable substitution`() {
        val result = I18n.translate(Language.MR, "goodMorning", mapOf("name" to "केतन"))
        assertEquals("शुभ प्रभात, केतन", result)
    }

    @Test
    fun `test plan extension notice translation in marathi`() {
        val result = I18n.translate(Language.MR, "planExtendedNotice")
        assertTrue(result.contains("सुट्टीच्या कालावधीनुसार मेस प्लॅनची मुदत आपोआप वाढवली गेली आहे"))
    }

    @Test
    fun `test localized values for meals and categories`() {
        assertEquals("दुपारचे जेवण", I18n.localizedValue(Language.MR, "Lunch"))
        assertEquals("रात्रीचे जेवण", I18n.localizedValue(Language.MR, "Dinner"))
        assertEquals("नाश्ता", I18n.localizedValue(Language.MR, "Breakfast"))
        assertEquals("Lunch", I18n.localizedValue(Language.EN, "Lunch"))
    }
}
