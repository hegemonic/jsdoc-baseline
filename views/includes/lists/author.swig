{% block author %}
    {% if author && author.length %}
        {% block author-content %}
            <dt>{{ translate('headings.authors', author.length) }}</dt>
            {% for singleAuthor in author %}
                <dd>{{ singleAuthor|resolveAuthorLinks|safe }}</dd>
            {% endfor %}
        {% endblock %}
    {% endif %}
{% endblock %}
