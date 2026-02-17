pipeline {
    agent any

    tools {
        nodejs 'Node16'
    }

    environment {
        APP_NAME = "FIRMS_UI"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        PORT = "3008"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI"
        BACKUP_PATH = "/var/lib/jenkins/FIRMS_UI_backup"
        BACKUP_KEEP = 5
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build && npm run export'
            }
        }

        stage('Backup Previous Deploy') {
            steps {
                sh """
                mkdir -p ${BACKUP_PATH}
                if [ -d "${DEPLOY_PATH}" ]; then
                    mv ${DEPLOY_PATH} ${BACKUP_PATH}/${APP_NAME}_backup_\$(date +%F_%H-%M-%S)
                fi
                # Keep only last ${BACKUP_KEEP} backups
                ls -1tr ${BACKUP_PATH} | grep ${APP_NAME}_backup_ | head -n -${BACKUP_KEEP} | xargs -r rm -rf
                """
            }
        }

        stage('Deploy') {
            steps {
                sh """
                mkdir -p ${DEPLOY_PATH}
                rsync -av --exclude='.git' ./out/ ${DEPLOY_PATH}/

                # Use PM2 to serve static files
                if pm2 list | grep -q ${APP_NAME}; then
                    pm2 restart ${APP_NAME}
                else
                    pm2 start serve --name "${APP_NAME}" -- -s ${DEPLOY_PATH} -l ${PORT}
                fi

                pm2 save
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                RETRIES=5
                COUNT=0
                until curl -s --head http://localhost:${PORT} | grep "200 OK"; do
                    COUNT=\$((COUNT+1))
                    echo "Waiting for app to start... Attempt \$COUNT"
                    sleep 5
                    if [ \$COUNT -ge \$RETRIES ]; then
                        exit 1
                    fi
                done
                """
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed! Rolling back to last backup..."
            sh """
            LAST_BACKUP=\$(ls -1tr ${BACKUP_PATH} | grep ${APP_NAME}_backup_ | tail -n 1)
            if [ -n "\$LAST_BACKUP" ]; then
                rm -rf ${DEPLOY_PATH}
                mv ${BACKUP_PATH}/\$LAST_BACKUP ${DEPLOY_PATH}
                pm2 restart ${APP_NAME} || pm2 start serve --name "${APP_NAME}" -- -s ${DEPLOY_PATH} -l ${PORT}
                pm2 save
            fi
            """
        }
    }
}
