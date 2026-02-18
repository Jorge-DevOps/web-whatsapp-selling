/**
 * CONFIGURACIÓN DE JENKINS PARA CI/CD
 * 
 * Este archivo es para ejecutar como Pipeline declarativo en Jenkins
 * Se puede usar tanto en Jenkins como en otras plataformas de CI/CD
 */

pipeline {
    agent any

    // Variables de entorno
    environment {
        // Credenciales y variables
        GITHUB_REPO = 'git@github.com:Jorge-DevOps/web-whatsapp-selling.git'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'jorgde/whatsapp-selling-bot'
        DOCKER_CREDENTIALS = 'docker-hub-credentials'
        GITHUB_CREDENTIALS = 'github-ssh-key'
        NODE_ENV = 'production'
        
        // Información de build
        BUILD_DIR = "${WORKSPACE}"
        ARTIFACT_DIR = "${BUILD_DIR}/artifacts"
    }

    // Triggers
    triggers {
        // Poll SCM cada 5 minutos
        pollSCM('H/5 * * * *')
        
        // También puede ser disparado por webhook de GitHub
        githubPush()
    }

    // Opciones del pipeline
    options {
        // Mantener últimos 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Timeout de 30 minutos
        timeout(time: 30, unit: 'MINUTES')
        
        // Timestamp en los logs
        timestamps()
        
        // Deshabilitar construcciones concurrentes
        disableConcurrentBuilds()
    }

    stages {
        stage('🔍 Checkout') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '📦 Clonando repositorio de GitHub...'
                    echo '════════════════════════════════════════════'
                }
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: "${GITHUB_REPO}",
                        credentialsId: "${GITHUB_CREDENTIALS}"
                    ]]
                ])
            }
        }

        stage('🧹 Clean') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '🧹 Limpiando espacio de trabajo...'
                    echo '════════════════════════════════════════════'
                }
                
                deleteDir()
                dir("${BUILD_DIR}") {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: "${GITHUB_REPO}",
                            credentialsId: "${GITHUB_CREDENTIALS}"
                        ]]
                    ])
                }
            }
        }

        stage('📥 Install Dependencies') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '📦 Instalando dependencias con npm...'
                    echo '════════════════════════════════════════════'
                }
                
                sh '''
                    node --version
                    npm --version
                    npm ci --only=production
                '''
            }
        }

        stage('🔍 Lint & Validate') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '✅ Validando código...'
                    echo '════════════════════════════════════════════'
                }
                
                sh '''
                    # Validar sintaxis de JavaScript
                    for file in src/**/*.js; do
                        if [ -f "$file" ]; then
                            node -c "$file" || exit 1
                        fi
                    done
                    
                    # Validar JSON
                    node -e "
                        const fs = require('fs');
                        const files = [
                            'package.json',
                            'src/data/property.json'
                        ];
                        
                        files.forEach(file => {
                            try {
                                JSON.parse(fs.readFileSync(file, 'utf8'));
                                console.log('✓ ' + file + ' es válido');
                            } catch(e) {
                                console.error('✗ Error en ' + file + ': ' + e.message);
                                process.exit(1);
                            }
                        });
                    "
                '''
            }
        }

        stage('🧪 Test') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '🧪 Ejecutando tests...'
                    echo '════════════════════════════════════════════'
                }
                
                sh '''
                    # Validar que archivos principales existen
                    test -f src/index.js || exit 1
                    test -f src/menu.js || exit 1
                    test -f src/handlers.js || exit 1
                    test -f src/data/property.json || exit 1
                    
                    # Validar sintaxis
                    node -c src/index.js
                    node -c src/menu.js
                    node -c src/handlers.js
                    node -c src/utils/validation.js
                    node -c src/utils/formatter.js
                    node -c src/utils/sessionManager.js
                    
                    echo "✓ Todos los tests de validación pasaron"
                '''
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '🐳 Construyendo imagen Docker...'
                    echo '════════════════════════════════════════════'
                }
                
                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:latest \
                        -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                        -f Dockerfile \
                        .
                    
                    echo "✓ Imagen Docker construida exitosamente"
                    docker images | grep ${DOCKER_IMAGE}
                '''
            }
        }

        stage('🔐 Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '📤 Subiendo imagen a Docker Hub...'
                    echo '════════════════════════════════════════════'
                }
                
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:latest
                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker logout
                        echo "✓ Imagen subida a Docker Hub"
                    '''
                }
            }
        }

        stage('📊 Generate Reports') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '📊 Generando reportes...'
                    echo '════════════════════════════════════════════'
                }
                
                sh '''
                    mkdir -p ${ARTIFACT_DIR}
                    
                    # Generar reporte de dependencias
                    npm list > ${ARTIFACT_DIR}/dependencies.txt || true
                    
                    # Información del build
                    cat > ${ARTIFACT_DIR}/build-info.txt << EOF
BUILD INFORMATION
════════════════════════════════════════════
Build Number: ${BUILD_NUMBER}
Build ID: ${BUILD_ID}
Build URL: ${BUILD_URL}
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git rev-parse --abbrev-ref HEAD)
Docker Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}
Build Timestamp: $(date)
Node Version: $(node --version)
NPM Version: $(npm --version)
════════════════════════════════════════════
EOF
                    
                    cat ${ARTIFACT_DIR}/build-info.txt
                '''
            }
        }

        stage('📦 Archive Artifacts') {
            steps {
                script {
                    echo '════════════════════════════════════════════'
                    echo '📦 Archivando artefactos...'
                    echo '════════════════════════════════════════════'
                }
                
                archiveArtifacts artifacts: 'artifacts/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            script {
                echo '════════════════════════════════════════════'
                echo '🏁 Limpiando espacio de trabajo...'
                echo '════════════════════════════════════════════'
            }
            
            // Limpiar Docker
            sh '''
                docker system prune -f || true
            '''
            
            // Generar resumen
            echo "Build completado. Revisa los reportes en ${ARTIFACT_DIR}"
        }
        
        success {
            script {
                echo '════════════════════════════════════════════'
                echo '✅ BUILD EXITOSO'
                echo '════════════════════════════════════════════'
                
                // Notificación de éxito
                sh '''
                    echo "Build exitoso del WhatsApp Selling Bot"
                    echo "Imagen: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                '''
            }
        }
        
        failure {
            script {
                echo '════════════════════════════════════════════'
                echo '❌ BUILD FALLIDO'
                echo '════════════════════════════════════════════'
                
                // Notificación de fallo
                sh '''
                    echo "BUILD FALLIDO - Revisa los logs"
                '''
            }
        }
    }
}

/**
 * INSTRUCCIONES DE CONFIGURACIÓN EN JENKINS:
 * 
 * 1. Crear nuevo Pipeline Job:
 *    - Jenkins → New Item → Pipeline
 *    - Nombre: "WhatsApp-Selling-Bot"
 * 
 * 2. Configurar Pipeline:
 *    - Pipeline → Definition: Pipeline script from SCM
 *    - SCM: Git
 *    - Repository URL: git@github.com:Jorge-DevOps/web-whatsapp-selling.git
 *    - Credentials: GitHub SSH key
 *    - Branch: */main
 *    - Script Path: Jenkinsfile
 * 
 * 3. Configurar credenciales:
 *    - Jenkins → Manage Credentials → Global
 *    - Docker Hub credentials (username/password)
 *    - GitHub SSH key
 * 
 * 4. Configurar webhooks de GitHub:
 *    - Settings → Webhooks
 *    - Payload URL: http://jenkins-server/github-webhook/
 *    - Content type: application/json
 *    - Trigger: Push events, Pull requests
 * 
 * 5. Ejecutar:
 *    - Build Now o esperar a push en GitHub
 */
