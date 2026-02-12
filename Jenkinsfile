pipeline {
    agent any

    tools {
        nodejs "Node16" // Make sure Node16 is configured in Jenkins global tools
    }

    environment {
        DEPLOY_PATH = "/root/siva/FIRMS_UI"
        SERVER_IP = "10.10.120.190"
        SERVER_PORT = "8080"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/KSivasankarR/FIRMS_UI.git',
                    credentialsId: 'KSivasankarR' // Your GitHub credentials in Jenkins
            }
        }

        stage('Check Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Ignore peer dependency conflicts for CI
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Project') {
            steps {
