{% block author %}
    {% if author && author.length %}
        {% block author-content %}
            {# TODO: pluralize #}
            <dt>Author</dt>
            {% for singleAuthor in author %}
                <dd>{{ singleAuthor|resolveAuthorLinks|safe }}</dd>
            {% endfor %}
        {% endblock %}
    {% endif %}
{% endblock %}
