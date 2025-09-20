#!/bin/bash

echo "🔑 私钥环境变量配置助手"
echo "================================"

# 检查 .env 文件是否存在
ENV_FILE="packages/hardhat/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 创建 .env 文件..."
    cp packages/hardhat/.env.example "$ENV_FILE"
fi

echo ""
echo "请选择配置方式："
echo "1. 使用测试私钥 (仅用于开发测试)"
echo "2. 手动输入私钥"
echo "3. 查看当前配置"
echo "4. 退出"
echo ""

read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo "🔧 配置测试私钥..."
        # 使用 Hardhat 默认测试私钥
        sed -i.bak 's/__RUNTIME_DEPLOYER_PRIVATE_KEY=.*/__RUNTIME_DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80/' "$ENV_FILE"
        echo "✅ 测试私钥已配置"
        echo "⚠️  注意: 这是测试私钥，仅用于开发，不要在生产环境使用！"
        ;;
    2)
        echo "🔐 请输入您的私钥："
        read -s -p "私钥 (以 0x 开头): " private_key
        echo ""
        if [[ $private_key =~ ^0x[a-fA-F0-9]{64}$ ]]; then
            sed -i.bak "s/__RUNTIME_DEPLOYER_PRIVATE_KEY=.*/__RUNTIME_DEPLOYER_PRIVATE_KEY=$private_key/" "$ENV_FILE"
            echo "✅ 私钥已配置"
        else
            echo "❌ 私钥格式不正确！应该是 64 位十六进制字符串，以 0x 开头"
        fi
        ;;
    3)
        echo "📋 当前配置："
        if [ -f "$ENV_FILE" ]; then
            echo "环境变量文件: $ENV_FILE"
            if grep -q "__RUNTIME_DEPLOYER_PRIVATE_KEY=" "$ENV_FILE"; then
                private_key=$(grep "__RUNTIME_DEPLOYER_PRIVATE_KEY=" "$ENV_FILE" | cut -d'=' -f2)
                if [ "$private_key" = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" ]; then
                    echo "私钥状态: ✅ 已配置 (测试私钥)"
                elif [ -n "$private_key" ] && [ "$private_key" != "" ]; then
                    echo "私钥状态: ✅ 已配置 (自定义私钥)"
                else
                    echo "私钥状态: ❌ 未配置"
                fi
            else
                echo "私钥状态: ❌ 未配置"
            fi
        else
            echo "❌ .env 文件不存在"
        fi
        ;;
    4)
        echo "👋 退出配置"
        exit 0
        ;;
    *)
        echo "❌ 无效选项"
        ;;
esac

echo ""
echo "🎯 下一步："
echo "1. 配置完成后，运行: yarn deploy --network monadTestnet"
echo "2. 查看详细说明: cat PRIVATE_KEY_SETUP.md"
echo ""
