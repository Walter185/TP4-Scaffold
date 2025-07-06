# 📘 Proyecto TP4 - SimpleSwap & Tokens

**Autor:** Walter Liendo - Estudiante de EthKipu  
**Red:** Sepolia  
**Contratos Verificados:**  
- Token A: [`0x06B27208fA66d387633EfBe628f02a15d6608A1F`](https://sepolia.etherscan.io/address/0x06B27208fA66d387633EfBe628f02a15d6608A1F)
- Token B: [`0xeC6CDbB141aEc0C981c0E5e4a825227E412f7B99`](https://sepolia.etherscan.io/address/0xeC6CDbB141aEc0C981c0E5e4a825227E412f7B99)
- SimpleSwap: [`0x3F5C540D9087f4C95Ca6264B65A170353d2Ab03D`](https://sepolia.etherscan.io/address/0x3F5C540D9087f4C95Ca6264B65A170353d2Ab03D)

---

## 📦 Estructura del Proyecto

```bash
front/
├── packages/
│   ├── hardhat/           # Contratos y scripts de deploy
│   └── nextjs/            # Frontend con Next.js
├── .yarn/
│   ├── releases/          # Yarn 3.x configurado con Corepack
│   └── plugins/           # Plugins personalizados (TypeScript, Interactive Tools)
├── .yarnrc.yml            # Configuración avanzada de Yarn
├── package.json           # Workspaces y dependencias
└── README.md              # Este archivo
```

---

## 🚀 Instalación

1. Clona el repositorio

```bash
git clone https://github.com/Walter185/TP4-Scaffold.git
cd TP4-Scaffold
```

2. Asegúrate de tener `corepack` habilitado (viene con Node >= 16.9)

```bash
corepack enable
corepack prepare yarn@3.2.3 --activate
```

3. Instala dependencias

```bash
yarn install
```

---

## 🧪 Testing

Desde la carpeta `packages/hardhat`:

```bash
cd packages/hardhat
yarn hardhat test
```

---

## 📜 Descripción de los Contratos

### 🪙 TokenA y TokenB

- ERC20 sin comisiones
- Función `mint` accesible solo por el owner
- Usados para swap 1:1 dentro del contrato `SimpleSwap`

### 🔄 SimpleSwap

- Swap 1:1 entre dos tokens compatibles
- Función `addLiquidity`, `removeLiquidity`
- Función `getPrice` y `getAmountOut`
- Cálculo con reserva y sin comisiones

---

## 🖼 Frontend

- Con Next.js + ethers.js
- Interfaz simple tipo Scaffold-eth
- Conecta con MetaMask
- Permite:
  - Hacer swap
  - Ver precios
  - Añadir/quitar liquidez
  - Visualizar balances

---

## 🔍 Scripts Útiles

### Verificación del contrato

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <constructor_args...>
```

Asegúrate de tener configurado `.env` con:

```
ETHERSCAN_API_KEY=tu_api_key
```

---

## ✅ Requisitos cumplidos del TP4

- ✅ Contratos verificados
- ✅ Frontend funcional
- ✅ Funciones completas (`swap`, `getPrice`, `getAmountOut`, `liquidez`)
- ✅ Tests con cobertura ≥ 50%
- ✅ Proyecto en GitHub
- ✅ Desplegado en Vercel

---

## 🛠 Tecnologías

- Solidity 0.8.20
- Hardhat con hardhat-deploy
- Next.js + React + ethers.js
- Yarn 3.2.3 con Corepack
- Vercel para deploy
- Sepolia como red de pruebas

---

## 🧠 Lecciones aprendidas

- Uso de Uniswap V2 como referencia
- Gestión de workspaces con Yarn
- Deploy y verificación de contratos en Sepolia
- Debugging con Vercel y Corepack

---

## 🙌 Acknowledgements

Special thanks to:

- **Cris** – for the clarity and Solidity guidance  
- **Juan David** – for the support and feedback throughout the course

---

## 👨‍💻 Author

**Walter Liendo**  
EthKipu Blockchain Developer – 2025  
Argentina 🇦🇷