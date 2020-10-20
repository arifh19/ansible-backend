def builderDocker
def CommitHash
def REPO = 'arifh19/restaurant-backend'
def BRANCH_DEV = 'dev'
def BRANCH_PROD = 'master'
def REMOTE_DIR = 'ansibleBackend'
def PROJECT_DIR = '/home/ansman/project/restaurant-backend/ansible'

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
                    sh 'yarn install'
                }
            }
        }
        stage('Run Testing') {
            when {
                expression {
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
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'ctrl-node',
                                verbose: false,
                                transfers: [
                                    sshTransfer(
                                        sourceFiles: "ansible/vars.yml",
                                        remoteDirectory: "${REMOTE_DIR}",
                                        execTimeout: 120000,
                                    )
                                ]
                            )
                        ]
                    )
                }
                script {
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'ctrl-node',
                                verbose: false,
                                transfers: [
                                    sshTransfer(
                                        sourceFiles: "ansible/builder.yml",
                                        remoteDirectory: "${REMOTE_DIR}",
                                        execCommand: "ansible-playbook ${REMOTE_DIR}/builder.yml --extra-vars 'branch=${BRANCH_NAME}'",
                                        execTimeout: 120000,
                                    )
                                ]
                            )
                        ]
                    )
                }
            }
        }
        stage('Test Container') {
            steps {
                script {
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'ctrl-node',
                                verbose: false,
                                transfers: [
                                    sshTransfer(
                                        execCommand: "ansible-playbook -i ${PROJECT_DIR}/hosts ${PROJECT_DIR}/testing.yml --extra-vars 'branch=${BRANCH_NAME}'",
                                        execTimeout: 120000,
                                    )
                                ]
                            )
                        ]
                    )
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
                                    configName: 'ctrl-node',
                                    verbose: false,
                                    transfers: [
                                        sshTransfer(
                                            execCommand: "ansible-playbook -i ${PROJECT_DIR}/hosts ${PROJECT_DIR}/deployProd.yml --extra-vars 'branch=${BRANCH_NAME}'",
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
                                    configName: 'ctrl-node',
                                    verbose: false,
                                    transfers: [
                                        sshTransfer(
                                            execCommand: "ansible-playbook -i ${PROJECT_DIR}/hosts ${PROJECT_DIR}/deployDev.yml --extra-vars 'branch=${BRANCH_NAME}'",
                                            execTimeout: 120000,
                                        )
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
