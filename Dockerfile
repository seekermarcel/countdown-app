FROM eclipse-temurin:17-jdk

# Install Node.js 18.x and npm
RUN apt-get update && apt-get install -y curl unzip
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Verify Node.js and npm versions
RUN node --version && npm --version

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p ${ANDROID_HOME} && cd ${ANDROID_HOME} && \
    curl -o sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip sdk.zip && \
    rm sdk.zip

# Set up Android SDK directory structure
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools/latest && \
    mv ${ANDROID_HOME}/cmdline-tools/bin ${ANDROID_HOME}/cmdline-tools/latest/ && \
    mv ${ANDROID_HOME}/cmdline-tools/lib ${ANDROID_HOME}/cmdline-tools/latest/

# Add Android SDK tools to PATH
ENV PATH="${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"

# Accept licenses and install required SDK components
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} \
    "platform-tools" \
    "platforms;android-33" \
    "build-tools;33.0.0"

# Update npm to latest version
RUN npm install -g npm

WORKDIR /app 