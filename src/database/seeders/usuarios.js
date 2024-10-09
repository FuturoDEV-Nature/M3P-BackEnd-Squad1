const { QueryInterface, Sequelize } = require("sequelize");
const Usuario = require('../../models/Usuario');

module.exports = {
    up: async (QueryInterface, Sequelize) => {
        await Usuario.bulkCreate([
            {
                nome: "Lucas Pereira",
                email: "lucas.pereira@hotmail.com",
                cpf: "12345678901",
                sexo: "Masculino",
                senha: "lucas123",
                data_nascimento: "1990-07-12",
                cep: "88030-000",
                rua: "Rua E",
                numero: 789,
                complemento: "Apto 301",
                bairro: "Centro",
                cidade: "Florianópolis",
                estado: "SC"
            },
            {
                nome: "Fernanda Souza",
                email: "fernanda.souza@hotmail.com",
                cpf: "98765432100",
                sexo: "Feminino",
                senha: "fernanda123",
                data_nascimento: "1995-04-03",
                cep: "88040-000",
                rua: "Rua F",
                numero: 567,
                complemento: "Casa",
                bairro: "Trindade",
                cidade: "Florianópolis",
                estado: "SC"
            },
            {
                nome: "Gabriel Oliveira",
                email: "gabriel.oliveira@hotmail.com",
                cpf: "11223344556",
                sexo: "Masculino",
                senha: "gabriel123",
                data_nascimento: "1988-11-22",
                cep: "88050-000",
                rua: "Rua G",
                numero: 123,
                complemento: "Bloco C",
                bairro: "Córrego Grande",
                cidade: "Florianópolis",
                estado: "SC"
            },
            {
                nome: "Mariana Lima",
                email: "mariana.lima@hotmail.com",
                cpf: "55667788990",
                sexo: "Feminino",
                senha: "mariana123",
                data_nascimento: "1993-02-15",
                cep: "88070-000",
                rua: "Rua H",
                numero: 345,
                complemento: "Apto 202",
                bairro: "Lagoa da Conceição",
                cidade: "Florianópolis",
                estado: "SC"
            },
            {
                nome: "Carlos Mendes",
                email: "carlos.mendes@hotmail.com",
                cpf: "33445566778",
                sexo: "Masculino",
                senha: "carlos123",
                data_nascimento: "1985-09-30",
                cep: "88060-000",
                rua: "Rua I",
                numero: 678,
                complemento: "Casa",
                bairro: "Pantanal",
                cidade: "Florianópolis",
                estado: "SC"
            }
        ]);
    },

    down: async (QueryInterface, Sequelize) => {
        await Usuario.destroy({
            where: {
                email: [
                    "lucas.pereira@hotmail.com",
                    "fernanda.souza@hotmail.com",
                    "gabriel.oliveira@hotmail.com",
                    "mariana.lima@hotmail.com",
                    "carlos.mendes@hotmail.com"
                ]
            }
        });
    }
};