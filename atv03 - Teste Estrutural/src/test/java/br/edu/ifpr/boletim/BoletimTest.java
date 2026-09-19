package br.edu.ifpr.boletim;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class BoletimTest {

    @Test
    void deveAprovarAlunoComMediaOito() {
        // Preparar: criar o objeto que será testado.
        Boletim boletim = new Boletim();

        // Executar: chamar um único método com uma entrada conhecida.
        String resultado = boletim.verificarSituacao(8);

        // Verificar: comparar o resultado esperado com o resultado obtido.
        assertEquals("APROVADO", resultado);
    }

    @Test
    void deveRecuperarNotaAlunoComMediaQuatro() {
        Boletim boletim = new Boletim();

        // Executar: chamar um único método com uma entrada conhecida.
        String resultado = boletim.verificarSituacao(4);

        // Verificar: comparar o resultado esperado com o resultado obtido.
        assertEquals("RECUPERACAO", resultado);
    }

    @Test
    void deveReprovarAlunoComMediaDois() {
        Boletim boletim = new Boletim();

        // Executar: chamar um único método com uma entrada conhecida.
        String resultado = boletim.verificarSituacao(2);

        // Verificar: comparar o resultado esperado com o resultado obtido.
        assertEquals("REPROVADO", resultado);
    }

    @Test
    void deveCalcularMediaIgualCinco() {
        Boletim boletim = new Boletim();

        double resultado = boletim.calcularMedia(5,5);

        assertEquals(5,resultado);

    }
    @Test
    void deveAprovarAlunoComMediaSete() {
        Boletim boletim = new Boletim();
        String resultado = boletim.verificarSituacao(7);
        assertEquals("APROVADO", resultado);
    }

    @Test
    void deveRecuperarAlunoComMediaQuatroPontoNove() {
        Boletim boletim = new Boletim();
        String resultado = boletim.verificarSituacao(4.9);
        assertEquals("RECUPERACAO", resultado);
    }

    @Test
    void deveCalcularMediaComDecimal() {
        Boletim boletim = new Boletim();
        double resultado = boletim.calcularMedia(5.5, 6.0);
        assertEquals(5.75, resultado, 0.0001);
    }

    @Test
    void contarAprovadosArrayVazio() {
        Boletim boletim = new Boletim();
        int resultado = boletim.contarAprovados(new double[] {});
        assertEquals(0, resultado);
    }

    @Test
    void contarAprovadosArrayUmElementoAprovado() {
        Boletim boletim = new Boletim();
        int resultado = boletim.contarAprovados(new double[] {8.0});
        assertEquals(1, resultado);
    }

    @Test
    void contarAprovadosArrayVariosElementos() {
        Boletim boletim = new Boletim();
        int resultado = boletim.contarAprovados(new double[] {7.0, 4.0, 9.5, 2.0, 8.0});
        assertEquals(3, resultado);
    }
}
