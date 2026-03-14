using controle.gastos.Domain.Enums;

namespace controle.gastos.App.Services;

public static class SelectTipo
{
    /*Método de conversão para poder receber o tipo como uma string*/
    public static Tipo GetTipo(this string tipo) // o Tipo entra String
    {
        if (!Enum.TryParse<Tipo>(tipo, true, out var Tipo)) //Converte para o 'Enum' Tipo
            throw new Exception("Tipo inválido");

        return Tipo; //Retorna o Enum necessário para Incluir ou alterar uma Categoria ou Transação
    }
}
