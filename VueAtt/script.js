const { createApp } = Vue;

createApp({
  data() {
    return {
      // Lista de livros
      equipamentos: [], // Mantendo o nome da variável para compatibilidade

      // Formulário
      form: {
        nome: '',
        categoria: '',
        patrimonio: '',
        status: ''
      },

      // Estado de edição
      isEditing: false,
      editingId: null,

      // Filtros
      filtros: {
        categoria: '',
        status: ''
      }
    }
  },

  computed: {
    // R7a) Contadores derivados
    totalEquipamentos() {
      return this.equipamentos.length;
    },

    totalDisponiveis() {
      return this.equipamentos.filter(livro => livro.status === 'disponível').length;
    },

    totalEmprestados() {
      return this.equipamentos.filter(livro => livro.status === 'emprestado').length;
    },

    // R7b) Lista filtrada
    equipamentosFiltrados() {
      return this.equipamentos.filter(livro => {
        const categoriaMatch = !this.filtros.categoria || livro.categoria === this.filtros.categoria;
        const statusMatch = !this.filtros.status || livro.status === this.filtros.status;
        return categoriaMatch && statusMatch;
      });
    },

    // Validação do formulário
    isFormValid() {
      return this.form.nome.trim() &&
        this.form.categoria &&
        this.form.patrimonio.trim() &&
        this.form.status;
    }
  },

  mounted() {
    // R6) Carregar dados do localStorage na inicialização
    this.carregarDados();
  },

  methods: {
    // R6) Persistência - Salvar no localStorage
    salvarDados() {
      localStorage.setItem('equipamentos', JSON.stringify(this.equipamentos));
    },

    // R6) Persistência - Carregar do localStorage
    carregarDados() {
      const dados = localStorage.getItem('equipamentos');
      if (dados) {
        this.equipamentos = JSON.parse(dados);
      }
    },

    // R1) Cadastro - Adicionar novo livro
    adicionarEquipamento() {
      if (!this.isFormValid) return;

      const novoLivro = {
        id: Date.now().toString(), // ID único e estável
        nome: this.form.nome.trim(),
        categoria: this.form.categoria,
        patrimonio: this.form.patrimonio.trim(),
        status: this.form.status
      };

      this.equipamentos.push(novoLivro);
      this.salvarDados();
      this.limparFormulario();
    },

    // R3) Edição - Carregar dados no formulário
    editarEquipamento(livro) {
      this.form.nome = livro.nome;
      this.form.categoria = livro.categoria;
      this.form.patrimonio = livro.patrimonio;
      this.form.status = livro.status;
      this.isEditing = true;
      this.editingId = livro.id;

      // Foco para acessibilidade
      this.$nextTick(() => {
        document.getElementById('nome').focus();
      });
    },

    // R3) Edição - Salvar alterações
    salvarEquipamento() {
      if (!this.isFormValid) return;

      const index = this.equipamentos.findIndex(eq => eq.id === this.editingId);
      if (index !== -1) {
        this.equipamentos[index] = {
          ...this.equipamentos[index],
          nome: this.form.nome.trim(),
          categoria: this.form.categoria,
          patrimonio: this.form.patrimonio.trim(),
          status: this.form.status
        };
        this.salvarDados();
        this.cancelarEdicao();
      }
    },

    // Cancelar edição
    cancelarEdicao() {
      this.isEditing = false;
      this.editingId = null;
      this.limparFormulario();
    },

    // R4) Remoção - Com confirmação
    removerEquipamento(id) {
      const livro = this.equipamentos.find(eq => eq.id === id);
      if (livro && window.confirm(`Tem certeza que deseja remover o livro "${livro.nome}"?`)) {
        this.equipamentos = this.equipamentos.filter(eq => eq.id !== id);
        this.salvarDados();

        // Se estava editando o item removido, cancelar edição
        if (this.editingId === id) {
          this.cancelarEdicao();
        }
      }
    },

    // Limpar formulário
    limparFormulario() {
      this.form.nome = '';
      this.form.categoria = '';
      this.form.patrimonio = '';
      this.form.status = '';
    }
  }
}).mount('#app');
