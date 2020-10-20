def builderDocker
def CommitHash
def REPO = 'arifh19/restaurant-backend'
def BRANCH_DEV = 'dev'
def BRANCH_PROD = 'master'
def REMOTE_DIR = 'restaurant'

pipeline {
    agent any
    parameters {
        booleanParam(name: 'RunTest', defaultValue: true, description: 'Toggle this value for testing')
        choice(name: 'CICD', choices: ['CI', 'CICD'], description: 'Pick something')
    }
    stages {
        stage('Build project') {
            steps {
                nodejs('nodejs12') {
                    sh 'npm install'
                }
            }
        }
        stage('Run Testing') {
            when {
                expression  {
                    params.RunTest
                }
            }
            steps {
                echo 'passed'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // CommitHash = sh (script : "git log -n 1 --pretty=format:'%H'", returnStdout: true)
                    buildDocker = docker.build("${REPO}:${GIT_BRANCH}")
                    // sh ('docker rmi $(docker images --filter "dangling=true" -q --no-trunc)')

                }
            }
        }
        stage('Push Image') {
            when {
                expression {
                    params.RunTest
                }
            }
            steps {
                script {
                    if (BRANCH_NAME == BRANCH_PROD) {
                        buildDocker.push("${GIT_BRANCH}")
                    }else {
                        buildDocker.push("${GIT_BRANCH}")
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    if (BRANCH_NAME == BRANCH_PROD) {
                        sshPublisher(
                            publishers: [
                                sshPublisherDesc(
                                    configName: 'production',
                                    verbose: false,
                                    transfers: [
                                        sshTransfer(
                                            // execCommand: "docker pull ${REPO}:latest; docker kill ${REPO}; docker run -d --rm --name ${REPO} -p 80:80 ${REPO}:latest",
                                            sourceFiles: "docker-compose.yml",
                                            remoteDirectory: "${REMOTE_DIR}",
                                            execCommand: "docker-compose -f restaurant/docker-compose.yml stop; docker rm restaurant_backend_1; docker rm restaurant_backend_2; docker rm restaurant_backend_3; docker rmi ${REPO}:${BRANCH_DEV}; docker-compose -f restaurant/docker-compose.yml up -d",
                                            execTimeout: 120000,
                                        )
                                    ]
                                )
                            ]
                        )
                    } else {
                        sshPublisher(
                            publishers: [
                                sshPublisherDesc(
                                    configName: 'development',
                                    verbose: false,
                                    transfers: [
                                        sshTransfer(
                                            sourceFiles: "docker-compose.dev.yml",
                                            remoteDirectory: "${REMOTE_DIR}",
                                            // execCommand: "docker rmi arifh19/cobatampil:${env.GIT_BRANCH}; docker pull arifh19/cobatampil:${env.GIT_BRANCH}; docker kill cobatampil; docker run -d --rm --name cobatampil -p 80:80 arifh19/cobatampil:${env.GIT_BRANCH}",
                                            execCommand: "docker-compose -f restaurant/docker-compose.dev.yml stop; docker rm restaurant_backend_1; docker rm restaurant_backend_2; docker rm restaurant_backend_3; docker rmi ${REPO}:${BRANCH_DEV}; docker-compose -f restaurant/docker-compose.dev.yml up -d",
                                            execTimeout: 120000,
                                        ),
                                    ]
                                ),
                            ]
                        )
                    }
                    
                }
            }
        }
    }
}
