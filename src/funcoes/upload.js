const supabase = require('../servicos/supabase');

async function uploadImagem (nomeImagem, imagem) {
    const buffer = Buffer.from(imagem, 'base64');

    let resposta = [];

    try {
        const {  error } = await supabase
            .storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(nomeImagem, buffer);

        if (error) {
            return resposta.erro = error.message;
        }

        const { publicURL, error: errorPublicUrl} = supabase
            .storage
            .from(process.env.SUPABASE_BUCKET)
            .getPublicUrl(nomeImagem);

        if (errorPublicUrl) {
            return resposta.erro = errorPublicUrl.message;
        }

        return resposta.imagemUrl = publicURL;
        
    } catch (error) {
        return resposta.erro = error.message;
    }
}

module.exports = {
    uploadImagem
}