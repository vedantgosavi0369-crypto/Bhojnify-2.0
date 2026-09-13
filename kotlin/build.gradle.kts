plugins {
    kotlin("jvm") version "2.1.10" apply false
    kotlin("plugin.serialization") version "2.1.10" apply false
    id("com.android.application") version "8.8.0" apply false
    id("org.jetbrains.kotlin.android") version "2.1.10" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.1.10" apply false
    id("io.ktor.plugin") version "3.1.1" apply false
}

allprojects {
    group = "com.bhojnify"
    version = "1.0.0"

    repositories {
        google()
        mavenCentral()
    }
}
