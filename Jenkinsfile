pipeline {
    agent any

    environment {
        GIT_REPO = "https://github.com/KSivasankarR/FIRMS_UI.git"
        BRANCH   = "main"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        APP_NAME = "FIRMS_UI"
        PORT = "3008"
        MAX_BACKUPS = "3"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing Node.js dependencies (ignoring peer conflicts)..."
                npm install --legacy-peer-deps
                '''
            }
        }

        stage('Setup Environment') {
            steps {
                withCredentials([
                    string(credentialsId: 'BASE_URL', variable: 'BASE_URL'),
                    string(credentialsId: 'BACKEND_URL', variable: 'BACKEND_URL'),
                    string(credentialsId: 'PAYMENT_REDIRECT_URL', variable: 'PAYMENT_REDIRECT_URL'),
                    string(credentialsId: 'AADHAR_URL', variable: 'AADHAR_URL'),
                    string(credentialsId: 'BACKEND_STATIC_FILES', variable: 'BACKEND_STATIC_FILES'),
                    string(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                    string(credentialsId: 'IGRS_SECRET_KEY', variable: 'IGRS_SECRET_KEY'),
                    string(credentialsId: 'PAYMENT_VERIFY_URL', variable: 'PAYMENT_VERIFY_URL')
                ]) {
                    sh '''#!/bin/bash
echo "Creating .env.production for secure variables..."
cat > .env.production <<'END_ENV'
NEXT_PUBLIC_BASE_URL=$BASE_URL
NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL
NEXT_PUBLIC_PAYMENT_REDIRECT_URL=$PAYMENT_REDIRECT_URL
NEXT_PUBLIC_AADHAR_URL=$AADHAR_URL
NEXT_PUBLIC_BACKEND_STATIC_FILES=$BACKEND_STATIC_FILES
SECRET_KEY=$SECRET_KEY
IGRS_SECRET_KEY=$IGRS_SECRET_KEY
PAYMENT_VERIFY_URL=$PAYMENT_VERIFY_URL
END_ENV
'''
                }
            }
        }

        stage('Build App') {
            steps {
                sh '''
                echo "Building application..."
                npm run build
                '''
            }
        }

        stage('Backup Old Build') {
            steps {
                sh '''
                if [ -d "${DEPLOY_PATH}" ]; then
                    echo "Backing up previous build..."
                    TIMESTAMP=$(date +%Y%m%d%H%M%S)
                    BACKUP_PATH=${DEPLOY_PATH}_backup_${TIMESTAMP}
                    cp -r "${DEPLOY_PATH}" "$BACKUP_PATH"
                    echo "$BACKUP_PATH" > last_backup.txt

                    # Keep only last MAX_BACKUPS
                    BACKUPS=$(ls -dt ${DEPLOY_PATH}_backup_* 2>/dev/null | tail -n +$((MAX_BACKUPS+1)))
                    if [ ! -z "$BACKUPS" ]; then
                        echo "Removing old backups:"
                        echo $BACKUPS
                        rm -rf $BACKUPS
                    fi
                fi
                '''
            }
        }

        stage('Deploy Build') {
            steps {
                sh '''
                echo "Deploying new build to ${DEPLOY_PATH}..."
                mkdir -p "${DEPLOY_PATH}"
                rm -rf "${DEPLOY_PATH}"/*

                # Detect React or Next.js build
                if [ -d build ]; then
                    echo "React build detected (build/ folder)..."
                    cp -r build/* "${DEPLOY_PATH}/"
                elif [ -d out ]; then
                    echo "Next.js static export detected (out/ folder)..."
                    cp -r out/* "${DEPLOY_PATH}/"
                else
                    echo "ERROR: No build folder found!"
                    exit 1
                fi
                '''
            }
        }

        stage('Start/Reload PM2 Cluster') {
            steps {
                sh '''#!/bin/bash
echo "Starting or reloading FIRMS_UI with PM2 cluster on port ${PORT}..."

cat > ecosystem.config.json <<'END_PM2'
{
  "apps": [
    {
      "name": "${APP_NAME}",
      "script": "serve",
      "args": "${DEPLOY_PATH} -s -l ${PORT} -p ${PORT}",
      "instances": "max",
      "exec_mode": "cluster",
      "autorestart": true
    }
  ]
}
END_PM2

if pm2 list | grep -q "${APP_NAME}"; then
    pm2 reload ecosystem.config.json --only "${APP_NAME}" || exit 1
else
    pm2 start ecosystem.config.json || exit 1
fi

pm2 save
pm2 list
'''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Verifying FIRMS_UI deployment..."
                sleep 5
                curl -I http://localhost:${PORT} || exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "🔥 FIRMS_UI Deployment Successful on port ${PORT} with PM2 Cluster!"
            sh '''
            DEPLOY_TIME=$(date +%Y-%m-%d_%H-%M-%S)
            GIT_COMMIT=$(git rev-parse --short HEAD)
            PM2_ID=$(pm2 id ${APP_NAME})
            echo "$DEPLOY_TIME - Commit $GIT_COMMIT - PM2 ID $PM2_ID" >> "${DEPLOY_PATH}/deployments.log"
            '''
        }
        failure {
            echo "❌ Deployment Failed! Rolling back..."
            sh '''
            if [ -f last_backup.txt ]; then
                BACKUP=$(cat last_backup.txt)
                echo "Restoring backup: $BACKUP"
                rm -rf "${DEPLOY_PATH}"/*
                cp -r "$BACKUP"/* "${DEPLOY_PATH}/"
                pm2 reload "${APP_NAME}" || echo "PM2 reload failed during rollback"
            else
                echo "No backup found to rollback!"
            fi
            '''
        }
    }
}
