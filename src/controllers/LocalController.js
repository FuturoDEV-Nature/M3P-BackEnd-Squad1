const Local = require('../models/Local');
const axios = require('axios');

class LocalController {
    async adicionarLocal(req, res) {
        /*
            #swagger.tags = ['Local']
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Cadastra novos locais!',
                schema: {
                    $nome: 'Trilha Morro das aranhas',
                    $descricao: 'Trilha com vista para as praias do Santinho, Moçambique e Ingleses',
                    $cep: '88058-700',
                }
            }
        */
        try {
            const usuarioId = req.payload.sub;
            const { nome, descricao, cep } = req.body;

            if (!nome || !cep) {
                return res.status(400).json({ message: 'Nome e CEP são obrigatórios!' });
            }

            const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);

            if (!response.data || response.data.length === 0) {
                return res.status(400).json({ message: 'Endereço não localizado' });
            }

            const { address_name: rua, district: bairro, city: cidade, state: estado, lat, lng: lon } = response.data;

            const novoLocal = await Local.create({
                nome,
                descricao,
                cep,
                rua,
                bairro,
                cidade,
                estado,
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                usuarioId
            });

            return res.status(201).json(novoLocal);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao cadastrar o local', error: error.message });
        }
    }


    async atualizarLocal(req, res) {
        /*
         #swagger.tags = ['Local'],
         #swagger.parameters = ['body'] ={
            in: 'body',
            description:'Atualizar endereço!',
            schema: {
                $nome: 'Morro das Aranhas',
                $descricao: 'Trilha fácil',
                $cep: '88058-700'
            }   
        }
        */
        try {
            const usuarioId = req.payload.sub;
            const { nome, descricao, cep } = req.body;

            if (!nome || !cep) {
                return res.status(400).json({ message: 'Nome e CEP são obrigatórios!' });
            }

            const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);

            if (!response.data || response.data.length === 0) {
                return res.status(400).json({ message: 'Endereço não localizado' });
            }

            const { address_name: rua, district: bairro, city: cidade, state: estado, lat, lng: lon } = response.data;


            const localAtualizar = await Local.findOne({ where: { id: req.params.localId, usuarioId } });

            if (!localAtualizar) {
                return res.status(404).json({ message: 'Local não encontrado!' });
            }


            localAtualizar.nome = nome;
            localAtualizar.descricao = descricao;
            localAtualizar.cep = cep;
            localAtualizar.rua = rua;
            localAtualizar.bairro = bairro;
            localAtualizar.cidade = cidade;
            localAtualizar.estado = estado;
            localAtualizar.latitude = parseFloat(lat);
            localAtualizar.longitude = parseFloat(lon);

            await localAtualizar.save();

            res.status(200).json(localAtualizar);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Não foi possível atualizar as informações do local.' });
        }
    }

    async deletarLocal(req, res) {
        /*  
        #swagger.tags = ['Local'],  
        #swagger.parameters['usuarioId'] = {
            in: 'query',
            description: 'Excluir local',
            type: 'string'
        } 
        */
        try {
            const usuarioId = req.payload.sub;
            const localDeletar = await Local.findOne({ where: { id: req.params.localId, usuarioId } });

            if (!localDeletar) {
                return res.status(404).json({ message: 'Local não encontrado.' });
            }
            await localDeletar.destroy();

            res.status(200).json({ message: 'Local excluído com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Não foi possível excluir o local' });
        }
    }

    async listarTodosOsLocais(req, res) {
        /* #swagger.tags = ['Local'],  
        #swagger.description = 'Buscar todos os locais cadastrados'
        */
        try {
            const locais = await Local.findAll();

            if (!locais || locais.length === 0) {
                return res.status(404).json({ message: 'Nenhum local cadastrado' });
            }

            res.status(200).json(locais);
        } catch (error) {
            return res.status(500).json({ error: 'Não foi possível obter os locais cadastrados' });
        }
    }

async listarLocaisPorUsuario(req, res) {
    try {
        const usuarioId = req.payload.sub;
        const locais = await Local.findAll({ where: { usuarioId } });

        if (!locais || locais.length === 0) {
            return res.status(404).json({ message: 'Nenhum local cadastrado por este usuário' });
        }

        res.status(200).json(locais);
    } catch (error) {
        return res.status(500).json({ error: 'Não foi possível obter os locais cadastrados' });
    }
}


    async exibirLocal(req, res) {
        /* #swagger.tags = ['Local'],  
        #swagger.description = 'Exibir local específico do usuário'
        #swagger.parameters['localId'] = {
            in: 'path',
            description: 'ID do local',
            required: true,
            type: 'string'
        }
        */
        try {
            const usuarioId = req.payload.sub;
            const localId = req.params.localId;

            console.log("usuarioId:", usuarioId);
            console.log("localId:", localId);

            const local = await Local.findOne({ where: { id: localId } });

            console.log("Local encontrado:", local);

            if (!local) {
                return res.status(404).json({ message: 'Local não encontrado ou acesso não permitido' });
            }

            res.status(200).json(local);
        } catch (error) {
            console.error("Erro ao buscar o local:", error);
            return res.status(500).json({ error: 'Não foi possível obter o local' });
        }
    }

    async getLinkGoogleMaps(req, res) {
        /*
          #swagger.tags = ['Local'],  
          #swagger.parameters['Local_id'] = {
              in: 'query',
              description: 'Filtrar local pelo ID',
              type: 'string'
        }
        */
        try {
            const usuarioId = req.payload.sub;
            const local = await Local.findOne({ where: { id: req.params.localId } });

            if (!local) {
                return res.status(404).json({ message: 'Local não encontrado ou acesso não permitido' });
            }

            const googleMapsLink = `https://www.google.com/maps?q=${local.latitude},${local.longitude}`;
            res.status(200).json({ googleMapsLink });
        } catch (error) {
            return res.status(500).json({ error: 'Não foi possível obter o link do Google Maps para o local' });
        }
    }
}

module.exports = new LocalController();
