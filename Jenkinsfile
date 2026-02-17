pipeline {
    agent any

    environment {
        GIT_REPO = "https://github.com/KSivasankarR/FIRMS_UI.git"
        BRANCH   = "main"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        APP_NAME = "FIRMS_UI"
        PORT = "3008"
        MAX_BACKUPS = "3"
        NEXT_PUBLIC_BASE_URL = credentials('BASE_URL')
        NEXT_PUBLIC_BACKEND_URL = credentials('BACKEND_URL')
        NEXT_PUBLIC_PAYMENT_REDIRECT_URL = credentials('PAYMENT_REDIRECT_URL')
        NEXT_PUBLIC_AADHAR_URL = credentials('AADHAR_URL')
        NEXT_PUBLIC_BACKEND_STATIC_FILES = credentials('BACKEND_STATIC_FILES')
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

        stage('Build React App') {
            steps {
                withCredentials([
                    string(credentialsId: 'SECRET_KEY', variable: 'SECRET_KEY'),
                    string(credentialsId: 'IGRS_SECRET_KEY', variable: 'IGRS_SECRET_KEY'),
                    string(credentialsId: 'PAYMENT_VERIFY_URL', variable: 'PAYMENT_VERIFY_URL')
                ]) {
                    sh '''
                    echo "Building React app with secure environment variables..."
                    export SECRET_KEY=$SECRET_KEY
                    export IGRS_SECRET_KEY=$IGRS_SECRET_KEY
                    export PAYMENT_VERIFY_URL=$PAYMENT_VERIFY_URL

                    npm run build
                    '''
                }
            }
        }

        stage('Backup Old Build') {
            steps {
                sh '''
                if [ -d ${DEPLOY_PATH} ]; then
                    echo "Backing up previous build..."
                    TIMESTAMP=$(date +%Y%m%d%H%M%S)
                    BACKUP_PATH=${DEPLOY_PATH}_backup_${TIMESTAMP}
                    cp -r ${DEPLOY_PATH} $BACKUP_PATH
                    echo $BACKUP_PATH > last_backup.txt

                    # Keep only last MAX_BACKUPS
                    BACKUPS=$(ls -dt ${DEPLOY_PATH}_backup_* | tail -n +$((MAX_BACKUPS+1)))
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
                mkdir -p ${DEPLOY_PATH}
                rm -rf ${DEPLOY_PATH}/*
                cp -r build/* ${DEPLOY_PATH}/
                '''
            }
        }

        stage('Start/Reload PM2 Cluster') {
            steps {
                sh '''
                echo "Starting or reloading FIRMS_UI with PM2 cluster on port ${PORT}..."

                # Create PM2 ecosystem config
                cat > ecosystem.config.json <<EOF
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
EOF

                # Start or reload with ecosystem file
                if pm2 list | grep -q "${APP_NAME}"; then
                    pm2 reload ecosystem.config.json --only ${APP_NAME} || exit 1
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
            # Log deployment info
            DEPLOY_TIME=$(date +%Y-%m-%d_%H-%M-%S)
            GIT_COMMIT=$(git rev-parse --short HEAD)
            PM2_ID=$(pm2 id ${APP_NAME})
            echo "$DEPLOY_TIME - Commit $GIT_COMMIT - PM2 ID $PM2_ID" >> /var/lib/jenkins/FIRMS_UI/deployments.log
            '''
        }
        failure {
            echo "❌ Deployment Failed! Rolling back..."
            sh '''
            if [ -f last_backup.txt ]; then
                BACKUP=$(cat last_backup.txt)
                echo "Restoring backup: $BACKUP"
                rm -rf ${DEPLOY_PATH}/*
                cp -r $BACKUP/* ${DEPLOY_PATH}/
                pm2 reload ${APP_NAME} || echo "PM2 reload failed during rollback"
            else
                echo "No backup found to rollback!"
            fi
            '''
        }
    }
}
